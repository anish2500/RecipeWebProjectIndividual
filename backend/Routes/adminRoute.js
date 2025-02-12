import { Router } from "express";
import { create } from "../controller/users/adminController.js";
const router = Router();

router.post("/", create);

export default router;
