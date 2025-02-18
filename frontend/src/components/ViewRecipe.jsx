// React Component: ViewRecipe.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import Footer from './Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ViewRecipe.module.css';

const API_BASE_URL = 'http://localhost:5000';

const ViewRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecipe();
    }, [id]);

    const fetchRecipe = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/recipes/${id}`);
            
            if (response.data && response.data.data) {
                const recipeData = response.data.data;
                console.log('Received recipe data:', recipeData); // Debug log

                // Handle ingredients - expecting array of objects with ingredient and alternative
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
        const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        return `${API_BASE_URL}/${cleanPath}`;
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
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <NavBar />
            <div className={styles.contentWrap}>
                <button 
                    onClick={handleBack}
                    className={styles.backButton}
                >
                    ← Back to Recipes
                </button>
                
                <div className={styles.recipeContainer}>
                    <h1 className={styles.recipeTitle}>{recipe.title}</h1>
                    
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

                    <div className={styles.recipeDetails}>
                        <section className={styles.description}>
                            <h2>Description</h2>
                            <p>{recipe.description}</p>
                        </section>

                        <section className={styles.ingredients}>
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
                        </section>

                        <section className={styles.steps}>
                            <h2>Instructions</h2>
                            <ol>
                                {recipe.steps.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>
                        </section>

                        {recipe.categories && recipe.categories.length > 0 && (
                            <section className={styles.categories}>
                                <h2>Categories</h2>
                                <div className={styles.categoryTags}>
                                    {recipe.categories.map((category, index) => (
                                        <span key={index} className={styles.categoryTag}>
                                            {category}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default ViewRecipe;
