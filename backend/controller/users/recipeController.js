import { Recipe } from '../../model/recipeSchema.js';

const getAll = async (req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.status(200).send({ data: recipes, message: "Successfully fetched recipes" });
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
};

const create = async (req, res) => {
    try {
        const body = req.body;
        
        // Validation
        if (!body?.title || !body?.description || !body?.ingredients || !body?.steps) {
            return res.status(400).send({ message: "Invalid payload. Required fields: title, description, ingredients, steps" });
        }

        // Parse JSON strings back to objects/arrays
        const ingredients = typeof body.ingredients === 'string' ? JSON.parse(body.ingredients) : body.ingredients;
        const steps = typeof body.steps === 'string' ? JSON.parse(body.steps) : body.steps;
        const categories = typeof body.categories === 'string' ? JSON.parse(body.categories) : (body.categories || []);

        const recipe = await Recipe.create({
            title: body.title,
            description: body.description,
            ingredients: ingredients,
            steps: steps,
            image: req.file ? `/uploads/${req.file.filename}` : null,
            categories: categories
        });

        res.status(201).send({ 
            data: recipe, 
            message: "Successfully created recipe" 
        });
    } catch (e) {
        console.log(e);
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
            oldRecipe.image = `/uploads/${req.file.filename}`;
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
        
        res.status(200).send({ message: "Recipe fetched successfully", data: recipe });
    } catch (e) {
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



export const recipeController = { getAll, create, update, getById, deleteById };