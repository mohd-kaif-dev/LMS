import express from "express"
import { protect } from "../middlewares/auth.middleware.js";
import { updateUserRole } from "../controllers/user.controller.js";



const router = express.Router()

router.put("/update-role", protect, updateUserRole)

export default router;