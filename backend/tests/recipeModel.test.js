const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();




const RecipeMock = dbMock.define("Recipe", {
    id: 1, 
    image : "image.png",
    name: "Tea",
    description : "This is a tea",
    ingredients : "Tea leaves, water",
    steps: "Boil water, steep tea leaves",
    category: "Nepali"


});



describe ("Recipe Model", ()=>{
    it ("should create a recipe", async ()=>{
        const recipe = await RecipeMock .create({
            image : "recipe-1739694358428.jpg",
            name: " New Tea",
            description : "This is a new tea",
            ingredients : "Tea leaves and , water",
            steps: "Boil water, steep tea leaves",
            category: "American"
        });
        expect (recipe.image).toBe("recipe-1739694358428.jpg");
        expect(recipe.name).toBe("New Tea");
        expect(recipe.description).toBe("This is a new tea");
        expect(recipe.ingredients).toBe("Tea leaves and , water");
        expect(recipe.steps).toBe("Boil water, steep tea leaves");
        expect(recipe.category).toBe("American");
    });

    it ("should find recipe by id "), async ()=> {
        const recipe = await RecipeMock.findOne({where : {id : 1}});

        expect (recipe.id).toBe(1);
        expect(recipe.image).toBe("image.png");
        expect(recipe.name).toBe("Tea");
        expect(recipe.description).toBe("This is a tea");
        expect(recipe.ingredients).toBe("Tea leaves , water");
        expect(recipe.steps).toBe("Boil water, steep tea leaves");
        expect(recipe.category).toBe("Nepali");
    }

    it('should update a project', async()=>{
        const recipe = await RecipeMock.findOne({where : {id : 1}});
        recipe.category = "American";
        await recipe.save();
        expect(recipe.category).toBe("American");
    });

});