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
  const [newCategory, setNewCategory] = useState("");
  const [recipeId, setRecipeId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([{ ingredient: "", alternative: "" }]);
  const [image, setImage] = useState(null);

  const addStep = () => {
    setSteps([...steps, `Step ${steps.length + 1}`]);
  };

  const addCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleRecipeSearch = async (e) => {
    e.preventDefault();
    if (recipeId.trim()) {
      try {
        const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}`);
        if (response.ok) {
          const recipe = await response.json();
          // Update form fields with recipe data
          // Add implementation here
        } else {
          alert("Recipe not found!");
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        alert("Error fetching recipe. Please try again.");
      }
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

  return (
    <div className="whole">
      <NavBar/>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Add Recipe</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="recipe-search">Search Recipe by ID</label>
              <div className={styles.searchContainer}>
                <input 
                  type="text" 
                  id="recipe-search" 
                  value={recipeId}
                  onChange={(e) => setRecipeId(e.target.value)}
                  placeholder="Enter Recipe ID"
                />
                <button 
                  type="button" 
                  onClick={handleRecipeSearch}
                  className={styles.searchBtn}
                >
                  Search
                </button>
              </div>
            </div>
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
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter a category"
                  />
                  <button type="button" onClick={addCategory} className={styles.addBtn}>
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
                  <input key={index} type="text" name="step" placeholder={step} />
                ))}
              </div>
              <button type="button" className={styles.addBtn} onClick={addStep}>
                Add Step
              </button>
            </div>
            <div className={styles.formGroup}>
              <button type="submit" className={styles.submitBtn}>Add Recipe</button>
              <button type="button" className={styles.updateBtn}>Update Recipe</button>
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
