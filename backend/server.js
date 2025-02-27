import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { recipeRouter } from './Routes/recipeRoutes.js';
import adminRouter from './Routes/adminRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { db, sequelize } from './database/db.js';
import fs from 'fs';
import { authenticateToken } from './middleware/token-middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Basic CORS setup with specific origin
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Debug middleware for all requests
app.use((req, res, next) => {
    console.log('Request:', {
        path: req.path,
        method: req.method,
        headers: req.headers
    });
    next();
});

// Serve static files from uploads directory WITHOUT authentication
app.use('/uploads', (req, res, next) => {
    // Enable CORS for image requests
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    const filePath = path.join(__dirname, 'uploads', req.path);
    console.log('Image request:', {
        requestPath: req.path,
        fullPath: filePath,
        exists: fs.existsSync(filePath)
    });

    if (!fs.existsSync(filePath)) {
        console.log('Image not found:', filePath);
        return res.status(404).send('Image not found');
    }

    next();
}, express.static(path.join(__dirname, 'uploads')));

// Admin routes (before authentication middleware)
app.use('/api/admin', adminRouter);

// Apply authentication middleware to API routes only
app.use('/api', authenticateToken);
// Routes
app.use('/api/recipes', recipeRouter);
const PORT = 5000;

// Initialize database and start server
const startServer = async () => {
    try {
        await db();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log('Uploads directory:', uploadsDir);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();