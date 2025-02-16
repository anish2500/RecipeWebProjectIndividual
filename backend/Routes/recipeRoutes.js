import express from 'express';
import { recipeController } from '../controller/users/recipeController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, 'recipe-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
        }
    }
});

router.get('/', recipeController.getAll);


router.get('/:id', recipeController.getById);


router.post('/', upload.single('image'), recipeController.create);



router.put('/:id', upload.single('image'), recipeController.update);


router.delete('/:id', recipeController.deleteById);

export {router as recipeRouter};