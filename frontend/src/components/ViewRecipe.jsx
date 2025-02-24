import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import NavBar from './NavBar';
import Footer from './Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ViewRecipe.module.css';
import path from 'path';

const ViewRecipe = () => {
    const { recipeId } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (recipeId) {
            fetchRecipe();
        }
    }, [recipeId]); // Re-fetch when recipeId changes

    useEffect(() => {
        // Reset image states when recipe changes
        if (recipe?.image) {
            setImageLoaded(false);
            setImageError(false);
        }
    }, [recipe]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) {
            console.log('No image path provided, using placeholder');
            return '/placeholder-image.jpg';
        }

        // Clean up the path and ensure it starts with uploads/
        const cleanPath = imagePath.replace(/^\/+/, '').replace(/\\/g, '/');
        const fullPath = cleanPath.startsWith('uploads/') 
            ? cleanPath 
            : `uploads/${path.basename(cleanPath)}`;
            
        const imageUrl = `http://localhost:5000/${fullPath}`;
        console.log('Generated image URL:', imageUrl);
        return imageUrl;
    };

    const preloadImage = async (imageUrl) => {
        if (imageUrl.includes('placeholder-image.jpg')) {
            console.log('Using placeholder image, no preload needed');
            return Promise.resolve();
        }

        try {
            console.log('Attempting to preload image:', imageUrl);
            const img = new Image();
            
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    console.log('Image preloaded successfully:', imageUrl);
                    resolve();
                };
                
                img.onerror = (error) => {
                    console.error('Error preloading image:', {
                        url: imageUrl,
                        error: error?.message || 'Unknown error'
                    });
                    reject(new Error('Failed to preload image'));
                };
                
                img.src = imageUrl;
            });
        } catch (error) {
            console.error('Error in preloadImage:', error);
            throw error;
        }
    };

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

                // Update recipe data
                setRecipe({
                    ...recipeData,
                    ingredients: ingredients
                });

                // Handle image loading
                if (recipeData.image) {
                    try {
                        const imageUrl = getImageUrl(recipeData.image);
                        console.log('Attempting to load recipe image:', imageUrl);
                        await preloadImage(imageUrl);
                        setImageLoaded(true);
                        setImageError(false);
                    } catch (error) {
                        console.error('Failed to load recipe image:', error);
                        setImageError(true);
                        setImageLoaded(false);
                    }
                } else {
                    console.log('Recipe has no image, using placeholder');
                    setImageLoaded(true);
                    setImageError(false);
                }

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
                    
                    <div className={styles.imageContainer}>
                        <div className={styles.recipeImage}>
                            {!imageLoaded && !imageError && (
                                <div className={styles.loading}>Loading image...</div>
                            )}
                            {!imageError ? (
                                <img 
                                    src={getImageUrl(recipe.image)}
                                    alt={recipe.title || 'Recipe image'}
                                    className={`${styles.recipeImg} ${imageLoaded ? styles.loaded : ''}`}
                                    style={{ 
                                        opacity: imageLoaded ? 1 : 0,
                                        display: 'block'
                                    }}
                                    onLoad={(e) => {
                                        console.log('Image loaded in DOM:', e.target.src);
                                        setImageLoaded(true);
                                        setImageError(false);
                                    }}
                                    onError={(e) => {
                                        const currentSrc = e.target.src;
                                        console.error('Image load failed:', {
                                            url: currentSrc,
                                            recipeImage: recipe.image
                                        });

                                        // Always switch to placeholder on error
                                        setImageError(true);
                                        setImageLoaded(false);
                                    }}
                                />
                            ) : (
                                <div className={styles.imageError}>
                                    <img 
                                        src="/placeholder-image.jpg" 
                                        alt="Recipe placeholder" 
                                        className={styles.placeholderImage}
                                    />
                                    <div className={styles.errorMessage}>
                                        Image not available
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

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
