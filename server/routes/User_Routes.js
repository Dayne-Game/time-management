import express from "express";
const router = express.Router();

import { Login, Register } from "../controllers/UserController.js";

router.post("/login", Login);
router.post("/register", Register);

export default router;
