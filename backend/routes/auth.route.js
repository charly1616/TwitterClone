import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getMe, login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.get('/me', protectRoute, getMe)
router.post('/login', login)
router.post("/signup", signup)
router.post('/logout', logout)


export default router;