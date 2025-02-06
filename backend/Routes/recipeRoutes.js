import express from 'express';
import { recipeController } from '../controller/users/recipeController.js';

const router = express.Router();


router.get('/', recipeController.getAll);


router.get('/:id', recipeController.getById);


router.post('/', recipeController.create);


router.put('/:id', recipeController.update);


router.delete('/:id', recipeController.deleteById);

export {router as recipeRouter};