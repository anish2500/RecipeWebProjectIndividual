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

        const recipe = await Recipe.create({
            title: body.title,
            description: body.description,
            ingredients: body.ingredients, 
            steps: body.steps, 
            image: body.image,
            categories: body.categories || [] 
        });

        res.status(201).send({ data: recipe, message: "Successfully created recipe" });
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

        
        if (body.title) oldRecipe.title = body.title;
        if (body.description) oldRecipe.description = body.description;
        if (body.ingredients) oldRecipe.ingredients = body.ingredients;
        if (body.steps) oldRecipe.steps = body.steps;
        if (body.image) oldRecipe.image = body.image;
        if (body.categories) oldRecipe.categories = body.categories; 

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