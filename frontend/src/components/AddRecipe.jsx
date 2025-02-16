import React, { useState } from "react";
import styles from "./AddRecipe.module.css";
import NavBar from './NavBar';
import Footer from './Footer';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  // Predefined categories
  const availableCategories = [
    "Nepali",
    "Indian",
    "Italian",
    "Korean",
    "American"
  ];

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
      console.log("Raw API Response:", response); // Debug log for entire response

      if (response.data && response.data.data) {
        const recipe = response.data.data;
        console.log("Recipe data:", recipe); // Debug log for recipe data

        // Update form fields with recipe data
        setTitle(recipe.title || '');
        setDescription(recipe.description || '');
        
        // Handle ingredients - ensure it's an array
        const recipeIngredients = Array.isArray(recipe.ingredients) 
          ? recipe.ingredients 
          : [{ ingredient: "", alternative: "" }];
        setIngredients(recipeIngredients);
        
        // Handle steps - ensure it's an array
        const recipeSteps = Array.isArray(recipe.steps) 
          ? recipe.steps 
          : [""];
        setSteps(recipeSteps);

        // Handle categories - ensure it's an array
        const recipeCategories = Array.isArray(recipe.categories) 
          ? recipe.categories 
          : [];
        setCategories(recipeCategories);

        // After setting the state, verify the values
        console.log("Set title to:", recipe.title);
        console.log("Set description to:", recipe.description);
        console.log("Set ingredients to:", recipeIngredients);
        console.log("Set steps to:", recipeSteps);
        console.log("Set categories to:", recipeCategories);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData object for multipart/form-data
      const formData = new FormData();
      
      // Append image if it exists
      if (image) {
        formData.append('image', image);
      }

      // Get step values from inputs
      const stepValues = steps.map((_, index) => 
        document.getElementsByName('step')[index].value
      ).filter(step => step.trim() !== '');

      // Append all data to FormData
      formData.append('title', title);
      formData.append('description', description);
      formData.append('ingredients', JSON.stringify(ingredients.filter(ing => ing.ingredient.trim() !== '')));
      formData.append('steps', JSON.stringify(stepValues));
      formData.append('categories', JSON.stringify(categories));

      // Debug log
      console.log('Categories being sent:', categories);

      const response = await axios.post('http://localhost:5000/api/recipes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Changed from application/json
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
        
        // Reset file input
        const fileInput = document.getElementById('recipe-image');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error(error.response?.data?.error || 'Failed to create recipe. Please try again.');
    }
  };

  const handleUpdate = async () => {
    if (!recipeId.trim()) {
      toast.error("Please search for a recipe first!");
      return;
    }

    try {
      const formData = new FormData();
      
      if (image) {
        formData.append('image', image);
      }

      const stepValues = steps.map((_, index) => 
        document.getElementsByName('step')[index].value
      ).filter(step => step.trim() !== '');

      formData.append('title', title);
      formData.append('description', description);
      formData.append('ingredients', JSON.stringify(ingredients.filter(ing => ing.ingredient.trim() !== '')));
      formData.append('steps', JSON.stringify(stepValues));
      formData.append('categories', JSON.stringify(categories));

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
      toast.error(error.response?.data?.error || 'Failed to update recipe. Please try again.');
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
                name="recipe-image"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="recipe-title">Recipe Title</label>
              <input 
                type="text" 
                id="recipe-title" 
                name="recipe-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="recipe-description">Recipe Short Description</label>
              <textarea 
                id="recipe-description" 
                name="recipe-description" 
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="recipe-ingredients">Recipe Ingredients</label>
              {ingredients.map((ing, index) => (
                <div className={styles.ingredients} key={index}>
                  <input 
                    type="text" 
                    value={ing.ingredient}
                    onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                    placeholder="Ingredient" 
                    required
                  />
                  <input 
                    type="text" 
                    value={ing.alternative}
                    onChange={(e) => handleIngredientChange(index, 'alternative', e.target.value)}
                    placeholder="Ingredient Alternative" 
                  />
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
                    onClick={addCategory} 
                    className={styles.addBtn}
                    disabled={!selectedCategory}
                  >
                    Add Category
                  </button>
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
                  <input 
                    key={index} 
                    type="text" 
                    name="step" 
                    placeholder={`Step ${index + 1}`}
                    value={step}
                    onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                  />
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
              <button type="button" className={styles.deleteBtn}>Delete Recipe</button>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
