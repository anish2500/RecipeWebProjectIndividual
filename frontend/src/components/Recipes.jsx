import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import Footer from './Footer';
import styles from './Recipes.module.css';

const API_BASE_URL = 'http://localhost:5000';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/recipes`);
            console.log('Raw API response:', response); // Debug log
            
            if (response.data && response.data.data) {
                console.log('Fetched recipes:', response.data.data);
                setRecipes(response.data.data);
                setError(null);
            } else {
                console.error('Unexpected response structure:', response);
                setError('Invalid data format received from server');
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setError('Failed to load recipes. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewRecipe = (recipeId) => {
        navigate(`/view-recipe/${recipeId}`);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        // Remove any leading slashes to prevent double slashes in URL
        const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        return `${API_BASE_URL}/${cleanPath}`;
    };

    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <NavBar />
                <div className={styles.contentWrap}>
                    <div className={styles.loading}>Loading recipes...</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.pageContainer}>
                <NavBar />
                <div className={styles.contentWrap}>
                    <div className={styles.error}>{error}</div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <NavBar/>
            <div className={styles.contentWrap}>
                <div className={styles.mainContent}>
                    <h1 className={styles.title}>Our Recipes</h1>
                    {recipes.length === 0 ? (
                        <div className={styles.noRecipes}>
                            No recipes found. Add your first recipe!
                        </div>
                    ) : (
                        <div className={styles.recipeGrid}>
                            {recipes.map((recipe) => (
                                <div key={recipe.id} className={styles.recipeCard}>
                                    <div className={styles.imageContainer}>
                                        {recipe.image ? (
                                            <img 
                                                src={getImageUrl(recipe.image)}
                                                alt={recipe.title}
                                                className={styles.recipeImage}
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-image.jpg';
                                                    console.log('Image failed to load:', recipe.image);
                                                }}
                                            />
                                        ) : (
                                            <div className={styles.noImage}>No Image Available</div>
                                        )}
                                    </div>
                                    <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                                    <button 
                                        className={styles.viewButton}
                                        onClick={() => handleViewRecipe(recipe.id)}
                                    >
                                        View Recipe
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Recipes;
