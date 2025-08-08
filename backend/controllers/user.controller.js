import { User } from "../models/user.model.js";

export const updateUserRole = async (req, res) => {

    const { role } = req.body;

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("Current User:", user);
        console.log("New Role:", role);
        user.role = role;
        const updatedUser = await user.save();
        console.log("Updated User:", updatedUser);

        res.status(200).json({ message: "User role updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
