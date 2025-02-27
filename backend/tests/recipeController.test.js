import { recipeController } from "../../controller/recipeController.js";
import { Recipe } from "../../model/recipeSchema.js";
import { Op } from "sequelize";

jest.mock("../../model/recipeSchema.js", () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
}));

describe("Recipe Controller", () => {
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    it("should create a new recipe", async () => {
        const req = {
            body: {
                title: "Test Recipe",
                description: "Test Description",
                ingredients: JSON.stringify(["ingredient1", "ingredient2"]),
                steps: JSON.stringify(["step1", "step2"]),
                categories: JSON.stringify(["category1", "category2"])
            },
            file: { filename: "test.png" }
        };
        const res = mockResponse();

        Recipe.create.mockResolvedValue(req.body);
        await recipeController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({ data: req.body, message: "Recipe created successfully" });
    });

    it("should return all recipes", async () => {
        const req = {};
        const res = mockResponse();

        const recipes = [{ id: 1, title: "Test Recipe", image: "uploads/test.png" }];
        Recipe.findAll.mockResolvedValue(recipes);

        await recipeController.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ data: recipes, message: "Successfully fetched recipes" });
    });

    it("should return a recipe by ID", async () => {
        const req = { params: { id: 1 } };
        const res = mockResponse();

        const recipe = { id: 1, title: "Test Recipe", image: "uploads/test.png" };
        Recipe.findOne.mockResolvedValue(recipe);

        await recipeController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ message: "Recipe fetched successfully", data: recipe });
    });

    it("should update a recipe", async () => {
        const req = {
            params: { id: 1 },
            body: { title: "Updated Recipe" }
        };
        const res = mockResponse();

        Recipe.findOne.mockResolvedValue({ save: jest.fn() });
        await recipeController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ message: "Recipe updated successfully", data: expect.any(Object) });
    });

    it("should delete a recipe", async () => {
        const req = { params: { id: 1 } };
        const res = mockResponse();

        Recipe.findOne.mockResolvedValue({ destroy: jest.fn() });
        await recipeController.deleteById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ message: "Recipe deleted successfully" });
    });

    it("should return matching recipes for a search query", async () => {
        const req = { query: { query: "Test" } };
        const res = mockResponse();

        const recipes = [{ id: 1, title: "Test Recipe", description: "Test Description" }];
        Recipe.findAll.mockResolvedValue(recipes);

        await recipeController.searchRecipes(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: recipes, message: "Search successful" });
    });
});
