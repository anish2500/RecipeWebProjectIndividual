
import express from 'express'
import bodyParser from "body-parser";
import {db} from './database/db.js';

import {userRouter} from './Routes/userRoutes.js';
import dotenv from 'dotenv';
import {authRouter} from './Routes/authRoutes.js';
import { authenticateToken } from './middleware/token-middleware.js';

import {recipeRouter} from './Routes/recipeRoutes.js';

dotenv.config();

const app = express();


const port = process.env.PORT|| 5000

app.use(bodyParser.json());

app.use('/api/users', userRouter);
app.use('/api/recipes', recipeRouter);
app.use(authenticateToken);
app.use('/api/auth', authRouter);


app.listen(5000,function(){
    console.log("project running in port ")
    db()
  })