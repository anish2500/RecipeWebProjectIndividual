import { useState } from "react";
import styles from "./AddRecipe.module.css";

export default function AddRecipe() {
  const [steps, setSteps] = useState(["Step 1"]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

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

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Add Recipe</h1>
        <form>
          <div className={styles.formGroup}>
            <label htmlFor="recipe-image">Recipe Image</label>
            <input type="file" id="recipe-image" name="recipe-image" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="recipe-title">Recipe Title</label>
            <input type="text" id="recipe-title" name="recipe-title" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="recipe-description">Recipe Short Description</label>
            <textarea id="recipe-description" name="recipe-description" rows="3"></textarea>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="recipe-ingredients">Recipe Ingredients</label>
            <div className={styles.ingredients}>
              <input type="text" name="ingredient" placeholder="Ingredient" />
              <input type="text" name="ingredient-alternative" placeholder="Ingredient Alternative" />
            </div>
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
  );
}
