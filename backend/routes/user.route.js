import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import { followUnfollowUser, getSugestedUsers, getUserProfile, updateUser } from "../controllers/user.controller";


const router = express.Router();


router.get("/profile/:username", protectRoute, getUserProfile)
router.get("/sugested", protectRoute, getSugestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUser);


export default router;



