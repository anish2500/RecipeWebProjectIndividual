import React, { useState } from "react";
import styles from "./AddRecipe.module.css";
import NavBar from './NavBar';
import Footer from './Footer';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from "react-hook-form";
import path from 'path';

export default function AddRecipe() {
  const [steps, setSteps] = useState(["Step 1"]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [recipeId, setRecipeId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([{ ingredient: "", alternative: "" }]);
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // Predefined categories
  const availableCategories = [
    "Nepali",
    "Indian",
    "Italian",
    "Korean",
    "American"
  ];

  // Add React Hook Form
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    trigger,
    reset
  } = useForm();

  // Modify the form submission handler
  const onSubmit = async (formData) => {
    try {
      // Create FormData object for multipart/form-data
      const submitData = new FormData();

      // Append image if it exists
      if (image) {
        submitData.append('image', image);
      }

      // Get step values from inputs
      const stepValues = steps.map((step) => step).filter(step => step.trim() !== '');

      // Append all data to FormData
      submitData.append('title', title);
      submitData.append('description', description);
      submitData.append('ingredients', JSON.stringify(ingredients.filter(ing => ing.ingredient.trim() !== '')));
      submitData.append('steps', JSON.stringify(stepValues));
      submitData.append('categories', JSON.stringify(categories));

      // Debug log
      console.log('Data being sent:', {
        title,
        description,
        ingredients,
        steps: stepValues,
        categories
      });

      const response = await axios.post('http://localhost:5000/api/recipes', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 201) {
        toast.success(response.data.message || 'Recipe created successfully!');
        // Reset form
        setTitle("");
        setDescription("");
        setIngredients([{ ingredient: "", alternative: "" }]);
        setSteps(["Step 1"]);
        setCategories([]);
        setImage(null);
        reset(); // Reset React Hook Form state

        // Reset file input
        const fileInput = document.getElementById('recipe-image');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error(error.response?.data?.error || 'Failed to create recipe. Please try again.');
    }
  };

  // Modify the validateFields function
  const validateFields = async () => {
    const result = await trigger();
    if (!result) {
      if (errors.title) toast.error(errors.title.message);
      if (errors.description) toast.error(errors.description.message);
      if (errors.ingredients) toast.error("Please check ingredient fields");
      if (errors.steps) {
        const stepErrors = Object.values(errors.steps);
        stepErrors.forEach(error => {
          if (error.message) toast.error(`Step ${error.message}`);
        });
      }
      if (errors.categories) toast.error("Please add at least one category");

      return false;
    }
    return true;
  };

  // Modified handleSubmit to use React Hook Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateFields();
    if (!isValid) return;
    handleFormSubmit(onSubmit)(e);
  };

  const addStep = () => {
    setSteps([...steps, `Step ${steps.length + 1}`]);
  };

  const addCategory = () => {
    if (selectedCategory && !categories.includes(selectedCategory)) {
      setCategories([...categories, selectedCategory]);
      setSelectedCategory("");
    }
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleRecipeSearch = async (e) => {
    e.preventDefault();
    console.log("Searching for recipe ID:", recipeId);

    if (!recipeId.trim()) {
      toast.error("Please enter a recipe ID");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${recipeId}`);
      console.log("Raw API Response:", response);

      if (response.data && response.data.data) {
        const recipe = response.data.data;
        console.log("Recipe data:", recipe);

        setTitle(recipe.title || '');
        setDescription(recipe.description || '');

        // Handle ingredients
        const recipeIngredients = Array.isArray(recipe.ingredients)
          ? recipe.ingredients
          : [{ ingredient: "", alternative: "" }];
        setIngredients(recipeIngredients);

        // Handle steps
        const recipeSteps = Array.isArray(recipe.steps)
          ? recipe.steps
          : [""];
        setSteps(recipeSteps);

        // Handle categories
        const recipeCategories = Array.isArray(recipe.categories)
          ? recipe.categories
          : [];
        setCategories(recipeCategories);

        // Handle image
        if (recipe.image) {
          try {
            // Get the clean image path from the backend response
            const cleanPath = recipe.image.startsWith('uploads/') 
              ? recipe.image 
              : `uploads/${path.basename(recipe.image)}`;
            
            // Set the image preview URL
            const imageUrl = `http://localhost:5000/${cleanPath}`;
            setImagePreviewUrl(imageUrl);

            // Fetch the image as a blob
            const imageResponse = await fetch(imageUrl);
            const blob = await imageResponse.blob();

            // Create a File object from the blob
            const fileName = path.basename(recipe.image);
            const imageFile = new File([blob], fileName, { type: blob.type });
            setImage(imageFile);

            console.log("Image successfully loaded:", imageUrl);
          } catch (imageError) {
            console.error("Error loading image:", imageError);
            toast.warning("Recipe found but couldn't load the image");
          }
        } else {
          setImage(null);
          setImagePreviewUrl(null);
        }

        // After setting the state, verify the values
        console.log("Set title to:", recipe.title);
        console.log("Set description to:", recipe.description);
        console.log("Set ingredients to:", recipeIngredients);
        console.log("Set steps to:", recipeSteps);
        console.log("Set categories to:", recipeCategories);
        console.log("Set image to:", recipe.image);

        toast.success("Recipe found and loaded successfully!");
      } else {
        console.log("No data in response:", response);
        toast.error("Recipe data structure is invalid");
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
      toast.error(error.response?.data?.message || "Failed to fetch recipe");
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { ingredient: "", alternative: "" }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  // Modify the handleStepChange function
  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
    // Trigger validation for the changed step
    trigger(`steps.${index}`);
  };

  const handleUpdate = async () => {
    if (!recipeId.trim()) {
      toast.error("Please search for a recipe first!");
      return;
    }

    // Validate fields before updating
    const isValid = await validateFields();
    if (!isValid) return;

    try {
      const formData = new FormData();

      if (image) {
        formData.append('image', image);
      }

      // Get step values directly from the state
      const stepValues = steps.filter(step => step.trim() !== '');

      formData.append('title', title);
      formData.append('description', description);
      formData.append('ingredients', JSON.stringify(ingredients.filter(ing => ing.ingredient.trim() !== '')));
      formData.append('steps', JSON.stringify(stepValues));
      formData.append('categories', JSON.stringify(categories));

      // Debug log
      console.log('Update data being sent:', {
        title,
        description,
        ingredients: ingredients.filter(ing => ing.ingredient.trim() !== ''),
        steps: stepValues,
        categories
      });

      const response = await axios.put(`http://localhost:5000/api/recipes/${recipeId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 200) {
        toast.success('Recipe updated successfully!');
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error(error.response?.data?.message || 'Failed to update recipe. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!recipeId.trim()) {
      toast.error("Please search for a recipe first!");
      return;
    }

    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/recipes/${recipeId}`);

        if (response.status === 200) {
          toast.success('Recipe deleted successfully!');
          // Reset all form fields
          setRecipeId("");
          setTitle("");
          setDescription("");
          setIngredients([{ ingredient: "", alternative: "" }]);
          setSteps([""]);
          setCategories([]);
          setImage(null);

          // Reset file input
          const fileInput = document.getElementById('recipe-image');
          if (fileInput) fileInput.value = '';
        }
      } catch (error) {
        console.error('Error deleting recipe:', error);
        toast.error(error.response?.data?.error || 'Failed to delete recipe. Please try again.');
      }
    }
  };

  // Add image validation handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, or JPG)');
        e.target.value = '';
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        e.target.value = '';
        return;
      }
      setImage(file);
    }
  };

  return (
    <div className="whole">
      <NavBar/>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Add Recipe</h1>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Enter Recipe ID"
              value={recipeId}
              onChange={(e) => setRecipeId(e.target.value)}
            />
            <button
              type="button"
              onClick={handleRecipeSearch}
              className={styles.searchBtn}
            >
              Search Recipe
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="recipe-image">Recipe Image</label>
              <input
                type="file"
                id="recipe-image"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageChange}
              />
              {(image || imagePreviewUrl) && (
                <div className={styles.imagePreview}>
                  <img
                    src={imagePreviewUrl || (image ? URL.createObjectURL(image) : '')}
                    alt="Recipe preview"
                    style={{ maxWidth: '200px', marginTop: '10px' }}
                  />
                </div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="recipe-title">Recipe Title</label>
              <input
                type="text"
                id="recipe-title"
                value={title}
                {...register("title", {
                  required: "Recipe title is required",
                  minLength: { value: 3, message: "Title must be at least 3 characters" },
                  maxLength: { value: 100, message: "Title must not exceed 100 characters" }
                })}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <span className={styles.error}>{errors.title.message}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="recipe-description">Recipe Short Description</label>
              <textarea
                id="recipe-description"
                value={description}
                {...register("description", {
                  required: "Recipe description is required",
                  minLength: { value: 10, message: "Description must be at least 10 characters" },
                  maxLength: { value: 500, message: "Description must not exceed 500 characters" }
                })}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
              ></textarea>
              {errors.description && <span className={styles.error}>{errors.description.message}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="recipe-ingredients">Recipe Ingredients</label>
              {ingredients.map((ing, index) => (
                <div className={styles.ingredients} key={index}>
                  <input
                    type="text"
                    value={ing.ingredient}
                    {...register(`ingredients.${index}.ingredient`, {
                      required: "Ingredient name is required",
                      minLength: { value: 2, message: "Ingredient must be at least 2 characters" }
                    })}
                    onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                    placeholder="Ingredient"
                  />
                  <input
                    type="text"
                    value={ing.alternative}
                    {...register(`ingredients.${index}.alternative`, {
                      minLength: { value: 2, message: "Alternative must be at least 2 characters" }
                    })}
                    onChange={(e) => handleIngredientChange(index, 'alternative', e.target.value)}
                    placeholder="Ingredient Alternative"
                  />
                  {errors.ingredients?.[index]?.ingredient &&
                    <span className={styles.error}>{errors.ingredients[index].ingredient.message}</span>
                  }
                </div>
              ))}
              <button type="button" className={styles.addBtn} onClick={addIngredient}>
                Add Ingredient
              </button>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="recipe-categories">Recipe Categories</label>
              <div className={styles.categories}>
                <div className={styles.categoryInput}>
                  <select
                    value={selectedCategory}
                    {...register("selectedCategory", {
                      validate: {
                        notEmpty: value => categories.length > 0 || "Please add at least one category"
                      }
                    })}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={styles.categorySelect}
                  >
                    <option value="">Select a category</option>
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={addCategory}
                  >
                    Add Category
                  </button>
                  {errors.selectedCategory &&
                    <span className={styles.error}>{errors.selectedCategory.message}</span>
                  }
                </div>
                <div className={styles.categoryTags}>
                  {categories.map((category, index) => (
                    <span key={index} className={styles.categoryTag}>
                      {category}
                      <button
                        type="button"
                        onClick={() => removeCategory(index)}
                        className={styles.removeCategory}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="recipe-steps">Recipe Steps</label>
              <div className={styles.steps}>
                {steps.map((step, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      name="step"
                      value={step}
                      {...register(`steps.${index}`, {
                        required: "is required",
                        minLength: {
                          value: 5,
                          message: "must be at least 5 characters"
                        },
                        maxLength: {
                          value: 500,
                          message: "must not exceed 500 characters"
                        },
                        pattern: {
                          value: /^[A-Za-z0-9\s.,!?()-]+$/,
                          message: "contains invalid characters"
                        }
                      })}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      placeholder={`Step ${index + 1}`}
                      className={errors.steps?.[index] ? styles.errorInput : ''}
                    />
                    {errors.steps?.[index] && (
                      <span className={styles.error}>
                        {`Step ${index + 1} ${errors.steps[index].message}`}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" className={styles.addBtn} onClick={addStep}>
                Add Step
              </button>
            </div>
            <div className={styles.formGroup}>
              <button type="submit" className={styles.submitBtn}>Add Recipe</button>
              <button
                type="button"
                className={styles.updateBtn}
                onClick={handleUpdate}
              >
                Update Recipe
              </button>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={handleDelete}
              >
                Delete Recipe
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
