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
});

export { Recipe };