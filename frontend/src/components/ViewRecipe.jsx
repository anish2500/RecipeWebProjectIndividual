import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import NavBar from './NavBar';
import Footer from './Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ViewRecipe.module.css';

const ViewRecipe = () => {
    const { recipeId } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (recipeId) {
            fetchRecipe();
        }
    }, [recipeId]); // Re-fetch when recipeId changes

    const fetchRecipe = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api/recipes/${recipeId}`);
            
            if (response.data && response.data.data) {
                const recipeData = response.data.data;
                console.log('Received recipe data:', recipeData);

                // Handle ingredients
                const ingredients = Array.isArray(recipeData.ingredients) 
                    ? recipeData.ingredients.map(ing => {
                        return typeof ing === 'object' 
                            ? ing 
                            : { ingredient: ing, alternative: '' };
                    })
                    : [];

                // Update recipe data with properly formatted ingredients
                setRecipe({
                    ...recipeData,
                    ingredients: ingredients
                });
                setError(null);
            } else {
                setError('Recipe not found');
                toast.error('Recipe not found');
            }
        } catch (error) {
            console.error('Error fetching recipe:', error);
            setError('Failed to load recipe. Please try again later.');
            toast.error('Failed to load recipe');
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder-image.jpg';
        // Remove any leading slashes and ensure proper URL construction
        const cleanPath = imagePath.replace(/^\/+/, '');
        return `http://localhost:5000/${cleanPath}`; // Use absolute URL
    };

    const handleBack = () => {
        navigate('/recipes');
    };

    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <NavBar />
                <div className={styles.contentWrap}>
                    <div className={styles.loading}>Loading recipe...</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className={styles.pageContainer}>
                <NavBar />
                <div className={styles.contentWrap}>
                    <div className={styles.error}>{error || 'Recipe not found'}</div>
                    <button onClick={handleBack} className={styles.backButton}>
                        Back to Recipes
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <NavBar />
            <div className={styles.contentWrap}>
                <div className={styles.recipeContainer}>
                    <h1 className={styles.recipeTitle}>{recipe.title}</h1>
                    
                    {recipe.image && (
                        <div className={styles.imageContainer}>
                            <img 
                                src={getImageUrl(recipe.image)} 
                                alt={recipe.title}
                                className={styles.recipeImage}
                                onError={(e) => {
                                    e.target.src = '/placeholder-image.jpg';
                                }}
                            />
                        </div>
                    )}

                    <div className={styles.recipeDetails}>
                        <div className={styles.description}>
                            <h2>Description</h2>
                            <p>{recipe.description}</p>
                        </div>

                        <div className={styles.ingredients}>
                            <h2>Ingredients</h2>
                            <ul>
                                {recipe.ingredients.map((ing, index) => (
                                    <li key={index}>
                                        {ing.ingredient}
                                        {ing.alternative && (
                                            <span className={styles.alternative}>
                                                (Alternative: {ing.alternative})
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {recipe.steps && recipe.steps.length > 0 && (
                            <div className={styles.steps}>
                                <h2>Steps</h2>
                                <ol>
                                    {recipe.steps.map((step, index) => (
                                        <li key={index}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        {recipe.categories && recipe.categories.length > 0 && (
                            <div className={styles.categories}>
                                <h2>Categories</h2>
                                <div className={styles.categoryTags}>
                                    {recipe.categories.map((category, index) => (
                                        <span key={index} className={styles.categoryTag}>
                                            {category}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleBack}
                        className={styles.backButton}
                    >
                        Back to Recipes
                    </button>
                </div>
            </div>
            <Footer />
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default ViewRecipe;
