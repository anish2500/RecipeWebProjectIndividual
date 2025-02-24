import { Router } from "express";
import { create, login } from "../controller/users/adminController.js";
const router = Router();

router.post("/register", create);
router.post("/login", login);

export default router;


