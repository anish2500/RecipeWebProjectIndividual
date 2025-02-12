import React from "react";
import { useNavigate } from "react-router-dom";  
import styles from './Body.module.css'; 
import NavBar from './NavBar';
import Footer from './Footer';



const Body = ({ onSignOut }) => {
  const navigate = useNavigate(); 

  const handleViewRecipeClick = () => {
    navigate("/view-recipe");  
  };

  const scrollToRecipe = () => {
    const firstRecipe = document.querySelector(`.${styles.recipe}`);
    if (firstRecipe) {
      firstRecipe.scrollIntoView({ behavior: "smooth" });
    }
  };





  return (
    <>

<div className="wrapper">

    <div className="whole">
      <NavBar onSignOut={onSignOut}/>

      
    
      <div className={styles.hero}>
        <img className={styles.heroImage} src="./src/assets/food.jpg" alt="food" />
       
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>Discover Authentic Desi Recipes</h1>
          <p className={styles.heroDescription}>Find and share the best Indian and Nepali recipes</p>
          <button className={styles.heroButton} onClick={scrollToRecipe} >Start Cooking</button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Popular Regional Cuisines</h2>
        <div className={styles.cuisines}>
          <div className={styles.cuisine}>
            <p>North Indian</p>
          </div>
          <div className={styles.cuisine}>
            <p>South Indian</p>
          </div>
          <div className={styles.cuisine}>
            <p>Nepali</p>
          </div>
          <div className={styles.cuisine}>
            <p>Street Food</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Popular Recipes</h2>
        <div className={styles.recipes}>
          <div className={styles.recipe}>
            <img className={styles.recipeImage} src="https://storage.googleapis.com/a1aa/image/n63sJqwF6kL5Np3M0a85g3L3PBY3SNK8EcNDzuihPsGLrwAF.jpg" alt="Dal Bhat" />
            <p className={styles.recipeDescription}>Dal Bhat</p>
            <div className={styles.recipeDetails}>
              <span>45 mins • Medium</span>
              <span className={styles.recipeRating}>128</span>
            </div>
          </div>

          <div className={styles.recipe}>
            <img className={styles.recipeImage} alt="Thukpa" height="200" src="https://storage.googleapis.com/a1aa/image/Zgf7zXpU022VMyCWGgKupQJRRck5cPZxLAe4RLrwrCYlsCDUA.jpg" width="300"/>
            <p className={styles.recipeDescription}>Thukpa</p>
            <div className={styles.recipeDetails}>
              <span>45 mins • Medium</span>
              <span className={styles.recipeRating}>128</span>
            </div>
          </div>

          <div className={styles.recipe}>
            <img className={styles.recipeImage} src="./src/assets/sell.jpg" alt="Sel Roti" />
            <p className={styles.recipeDescription}>Sel Roti</p>
            <div className={styles.recipeDetails}>
              <span>45 mins • Medium</span>
              <span className={styles.recipeRating}>128</span>
            </div>
          </div>

          <div className={styles.recipe}>
            <img className={styles.recipeImage} alt="Yomari" height="200" src="./src/assets/yomari.jpg" width="300"/>
            <p className={styles.recipeDescription}>Yomari</p>
            <div className={styles.recipeDetails}>
              <span>45 mins • Medium</span>
              <span className={styles.recipeRating}>128</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recipe of the Day</h2>
        <div className={styles.recipeOfTheDay}>
          <img className={styles.recipeOfTheDayImage} src="https://storage.googleapis.com/a1aa/image/p6cfBS85jYTnTKjObp06maGvLjESCDCu8E2GksJlYeXosCDUA.jpg" alt="Dal Makhani" />
          <div className={styles.recipeOfTheDayContent}>
            <h3 className={styles.recipeOfTheDayTitle}>Dal Makhani</h3>
            <p className={styles.recipeOfTheDayDescription}>
              A rich and creamy lentil dish made with black lentils, butter, and aromatic spices. Perfect with naan or rice!
            </p>
            <div className={styles.recipeOfTheDayDetails}>
              <span>45 mins</span>
              <span>8 ingredients</span>
              <span>Serves 8</span>
            </div>
        
            <button className={styles.viewRecipeButton} onClick={handleViewRecipeClick}>View Recipe</button> {/* Added onClick */}
          </div>
        </div>
      </div>
      

      <Footer/>
      </div>
      </div>
    </>
  );
};

export default Body;
