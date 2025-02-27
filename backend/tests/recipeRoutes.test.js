const request = require("supertest");
const express = require("express");
const { recipeRouter } = require("../routes/recipeRouter");
const Recipe = require("../model/recipeSchema");

const app = express();
app.use(express.json());
app.use("/recipes", recipeRouter);

jest.mock("../model/recipeSchema");

describe("Recipe Routes", () => {
    it("should create a new recipe", async () => {
        const newRecipe = {
            title: "Test Recipe",
            description: "Test Description",
            ingredients: ["Ingredient1", "Ingredient2"],
            steps: ["Step1", "Step2"],
            categories: ["Category1"],
            image: "uploads/test.jpg"
        };

        Recipe.create.mockResolvedValue(newRecipe);

        const response = await request(app)
            .post("/recipes")
            .send(newRecipe);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            data: newRecipe,
            message: "Recipe created successfully"
        });
    });

    it("should get all recipes", async () => {
        const recipes = [
            {
                id: 1,
                title: "Test Recipe",
                description: "Test Description",
                ingredients: ["Ingredient1", "Ingredient2"],
                steps: ["Step1", "Step2"],
                categories: ["Category1"],
                image: "uploads/test.jpg"
            }
        ];

        Recipe.findAll.mockResolvedValue(recipes);

        const response = await request(app).get("/recipes");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ data: recipes, message: "Successfully fetched recipes" });
    });

    it("should get a recipe by ID", async () => {
        const recipe = {
            id: 1,
            title: "Test Recipe",
            description: "Test Description",
            ingredients: ["Ingredient1", "Ingredient2"],
            steps: ["Step1", "Step2"],
            categories: ["Category1"],
            image: "uploads/test.jpg"
        };

        Recipe.findOne.mockResolvedValue(recipe);

        const response = await request(app).get("/recipes/1");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Recipe fetched successfully", data: recipe });
    });

    it("should update a recipe", async () => {
        const updatedRecipe = {
            id: 1,
            title: "Updated Recipe",
            description: "Updated Description",
            ingredients: ["Updated Ingredient1"],
            steps: ["Updated Step1"],
            categories: ["Updated Category"],
            image: "uploads/updated.jpg"
        };

        Recipe.update.mockResolvedValue([1]);

        const response = await request(app)
            .put("/recipes/1")
            .send(updatedRecipe);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Recipe updated successfully" });
    });

    it("should delete a recipe", async () => {
        Recipe.destroy.mockResolvedValue(1);

        const response = await request(app).delete("/recipes/1");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Recipe deleted successfully" });
    });

    it("should search for recipes", async () => {
        const searchResults = [
            {
                id: 1,
                title: "Test Recipe",
                description: "Test Description",
                ingredients: ["Ingredient1", "Ingredient2"],
                steps: ["Step1", "Step2"],
                categories: ["Category1"],
                image: "uploads/test.jpg"
            }
        ];

        Recipe.findAll.mockResolvedValue(searchResults);

        const response = await request(app).get("/recipes/search?query=Test");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ data: searchResults, message: "Search successful" });
    });
});
