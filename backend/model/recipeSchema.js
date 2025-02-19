import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const Recipe = sequelize.define('Recipe', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    ingredients: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        // Will store array of objects: [{ ingredient: string, alternative: string }]
    },
    steps: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        // Will store array of strings
    },
    categories: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        // Will store array of strings representing categories
    }
}, {
    indexes: [
        {
            name: 'recipe_search_idx',
            fields: ['title']
        }
    ]
});

// Create the necessary PostgreSQL extensions and indexes
const initializeSearchCapabilities = async () => {
    try {
        await sequelize.query(`
            CREATE EXTENSION IF NOT EXISTS pg_trgm;
            CREATE INDEX IF NOT EXISTS recipe_title_trgm_idx ON "Recipes" USING gin (title gin_trgm_ops);
            CREATE INDEX IF NOT EXISTS recipe_description_trgm_idx ON "Recipes" USING gin (description gin_trgm_ops);
        `);
    } catch (error) {
        console.error('Error initializing search capabilities:', error);
    }
};

// Call this function when your application starts
initializeSearchCapabilities();

export { Recipe };