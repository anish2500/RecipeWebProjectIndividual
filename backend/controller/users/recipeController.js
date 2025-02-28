import { Recipe } from '../../model/recipeSchema.js';
import { Op } from 'sequelize';
import { sequelize } from '../../database/db.js';
import path from 'path';
import fs from 'fs';

// Helper function to verify image exists
const verifyImageExists = (imagePath) => {
    if (!imagePath) return null;
    const fullPath = path.join(process.cwd(), 'backend', imagePath);
    return fs.existsSync(fullPath) ? imagePath : null;
};

const getAll = async (req, res) => {
    try {
        const recipes = await Recipe.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        // Map recipes to include full image URLs
        const recipesWithFullUrls = recipes.map(recipe => {
            const recipeData = recipe.toJSON();
            if (recipeData.image) {
                // Ensure the image path is properly formatted and exists
                const cleanPath = recipeData.image.startsWith('uploads/') 
                    ? recipeData.image 
                    : `uploads/${path.basename(recipeData.image)}`;
                recipeData.image = verifyImageExists(cleanPath);
            }
            return recipeData;
        });

        res.status(200).send({ 
            data: recipesWithFullUrls,
            message: "Successfully fetched recipes" 
        });
    } catch (e) {
        console.error('Error fetching recipes:', e);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
};

const create = async (req, res) => {
    try {
        const body = req.body;
        
        if (!body?.title || !body?.description) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        let imagePath = null;
        if (req.file) {
            // Store the consistent path format
            imagePath = `uploads/${req.file.filename}`;
            console.log('Image path being saved to DB:', imagePath);
        }

        const recipe = await Recipe.create({
            title: body.title,
            description: body.description,
            ingredients: JSON.parse(body.ingredients || '[]'),
            steps: JSON.parse(body.steps || '[]'),
            categories: JSON.parse(body.categories || '[]'),
            image: imagePath // This now stores the correct relative path
        });

        res.status(201).send({
            data: recipe,
            message: "Recipe created successfully"
        });
    } catch (e) {
        console.error('Error creating recipe:', e);
        res.status(500).json({ error: 'Failed to create recipe' });
    }
};

const update = async (req, res) => {
    try {
        const { id = null } = req.params;
        const body = req.body;

        const oldRecipe = await Recipe.findOne({ where: { id } });
        if (!oldRecipe) {
            return res.status(404).send({ message: "Recipe not found" });
        }

        // Parse JSON strings back to objects/arrays if they exist
        if (body.title) oldRecipe.title = body.title;
        if (body.description) oldRecipe.description = body.description;
        if (body.ingredients) {
            oldRecipe.ingredients = typeof body.ingredients === 'string' 
                ? JSON.parse(body.ingredients) 
                : body.ingredients;
        }
        if (body.steps) {
            oldRecipe.steps = typeof body.steps === 'string' 
                ? JSON.parse(body.steps) 
                : body.steps;
        }
        if (req.file) {
            // Ensure consistent path format for updates
            oldRecipe.image = `uploads/${req.file.filename}`;
        }
        if (body.categories) {
            oldRecipe.categories = typeof body.categories === 'string' 
                ? JSON.parse(body.categories) 
                : body.categories;
        }

        await oldRecipe.save();
        res.status(200).send({ data: oldRecipe, message: "Recipe updated successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to update recipe' });
    }
};

const getById = async (req, res) => {
    try {
        const { id = null } = req.params;
        const recipe = await Recipe.findOne({ where: { id } });
        
        if (!recipe) {
            return res.status(404).send({ message: "Recipe not found" });
        }

        // Convert to plain object and format image path
        const recipeData = recipe.toJSON();
        if (recipeData.image) {
            // Ensure the image path is properly formatted and exists
            const cleanPath = recipeData.image.startsWith('uploads/') 
                ? recipeData.image 
                : `uploads/${path.basename(recipeData.image)}`;
            
            // Verify image exists and set to null if it doesn't
            recipeData.image = verifyImageExists(cleanPath);
            
            if (!recipeData.image) {
                console.log(`Image not found for recipe ${id}: ${cleanPath}`);
            }
        }
        
        res.status(200).send({ message: "Recipe fetched successfully", data: recipeData });
    } catch (e) {
        console.error('Error fetching recipe:', e);
        res.status(500).json({ error: 'Failed to fetch recipe' });
    }
};

const deleteById = async (req, res) => {
    try {
        const { id = null } = req.params;
        const recipe = await Recipe.findOne({ where: { id } });

        if (!recipe) {
            return res.status(404).send({ message: "Recipe not found" });
        }

        await recipe.destroy();
        res.status(200).send({ message: "Recipe deleted successfully" });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete recipe' });
    }
};
const searchRecipes = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(200).json({
                data: [],
                message: 'Empty search query'
            });
        }

        // Sanitize the search query
        const sanitizedQuery = query.trim().replace(/[%_]/g, '\\$&');

        const recipes = await Recipe.findAll({
            where: {
                [Op.or]: [
                    {
                        title: {
                            [Op.iLike]: `%${sanitizedQuery}%`
                        }
                    },
                    {
                        description: {
                            [Op.iLike]: `%${sanitizedQuery}%`
                        }
                    },
                    sequelize.where(
                        sequelize.cast(sequelize.col('categories'), 'text'),
                        { [Op.iLike]: `%${sanitizedQuery}%` }
                    )
                ]
            },
            limit: 10,
            order: [['title', 'ASC']]
        });

        // Format the response
        const formattedRecipes = recipes.map(recipe => {
            const recipeData = recipe.toJSON();
            if (recipeData.image) {
                // Ensure the image path is properly formatted
                const cleanPath = recipeData.image.startsWith('uploads/')
                    ? recipeData.image
                    : `uploads/${path.basename(recipeData.image)}`;
                recipeData.image = verifyImageExists(cleanPath);

                // Debugging: Log the image path
                if (!recipeData.image) {
                    console.log(`Image not found for recipe ${recipeData.id}: ${cleanPath}`);
                }
            }
            return recipeData;
        });

        return res.status(200).json({
            data: formattedRecipes,
            message: formattedRecipes.length > 0 ? 'Search successful' : 'No recipes found'
        });

    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({
            error: error.message,
            message: 'An error occurred during search'
        });
    }
};


export const recipeController = { getAll, create, update, getById, deleteById, searchRecipes };