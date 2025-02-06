// React Component: ViewRecipe.js
import React from 'react';
import styles from './ViewRecipe.module.css';

const ViewRecipe = () => {
    return (
        

        
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Classic Nepali Daal Bhaat</h1>
            </div>
            <div className={styles.imageContainer}>
                <img src="./src/assets/daalbhat.jpg" alt="daalbhat" />
            </div>
            <div className={styles.details}>
                <div>
                    <p>Prep Time: 20 mins</p>
                </div>
                <div>
                    <p>Cook Time: 30 mins</p>
                </div>
                <div>
                    <p>Servings: 4</p>
                </div>
            </div>
            <div className={styles.contentSection}>
                <h2>Ingredients</h2>
                <ul>
                    <li>Rice: 2 cups</li>
                    <li>Yellow Lentils (Moong or Toor Dal): 1 cup</li>
                    <li>Turmeric Powder: 1 tsp</li>
                    <li>Salt: to taste</li>
                    <li>Garlic: 4 cloves, minced</li>
                    <li>Ginger: 1-inch piece, minced</li>
                    <li>Green Chili: 2, chopped (optional)</li>
                    <li>Cumin Seeds: 1 tsp</li>
                    <li>Ghee or Oil: 2 tbsp</li>
                    <li>Fresh Coriander: for garnish</li>
                </ul>
            </div>
            <div className={styles.contentSection}>
                <h2>Ingredient Alternatives</h2>
                <ul>
                    <li>Yellow Lentils: Can be substituted with red lentils or split peas</li>
                    <li>Ghee: Can be substituted with butter or vegetable oil</li>
                    <li>Green Chili: Can be omitted or replaced with red chili powder</li>
                </ul>
            </div>
            <div className={styles.contentSection}>
                <h2>Instructions</h2>
                <ol>
                    <li>Wash the rice and lentils separately. Soak them in water for 10 minutes.</li>
                    <li>Cook the rice in a pot or rice cooker with 4 cups of water until soft and fluffy.</li>
                    <li>In another pot, boil the lentils with 4 cups of water, turmeric powder, and salt. Simmer until the lentils are soft and creamy.</li>
                    <li>In a small pan, heat ghee or oil. Add cumin seeds and let them splutter. Add minced garlic, ginger, and green chilies. Sauté until aromatic.</li>
                    <li>Pour the tempered mixture into the cooked lentils and stir well. Adjust salt as needed.</li>
                    <li>Serve the daal hot with steamed rice. Garnish with fresh coriander. Optionally, add a side of pickles and steamed vegetables.</li>
                </ol>
            </div>
        </div>
        
    );
};

export default ViewRecipe;
