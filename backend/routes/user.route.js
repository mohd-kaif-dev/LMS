import express from "express"
import { protect } from "../middlewares/auth.middleware.js";
import { updateUserRole, updateUser } from "../controllers/user.controller.js";



const router = express.Router()

router.put("/update-role", protect, updateUserRole)

router.put("/update-user", protect, updateUser)

export default router;