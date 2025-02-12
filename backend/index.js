
import express from 'express'
import bodyParser from "body-parser";
import {db} from './database/db.js';

import {userRouter} from './Routes/userRoutes.js';
import dotenv from 'dotenv';
import {authRouter} from './Routes/authRoutes.js';
import { authenticateToken } from './middleware/token-middleware.js';
import cors from 'cors';
import {recipeRouter} from './Routes/recipeRoutes.js';
import { createUploadsFolder } from './security/helper.js';
import uploadRoute from './Routes/uploadRoute.js';
import adminRoute from './Routes/adminRoute.js';

dotenv.config();

const app = express();
 
app.use(cors({
  origin: 'http://localhost:5173',
}));
const port = process.env.PORT|| 5000

app.use(bodyParser.json());

app.use('/api/users', userRouter);
app.use('/api/recipes', recipeRouter);
app.use(authenticateToken);
app.use('/api/auth', authRouter);
app.use('/api/file', uploadRoute);
app.use('/api/admin', adminRoute);

createUploadsFolder();

app.listen(5000,function(){
    console.log("project running in port ")
    db()
  })