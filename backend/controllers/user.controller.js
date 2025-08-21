import User from "../models/user.model.js";

export const updateUserRole = async (req, res) => {

    const { role } = req.body;
    console.log("Role", role);
    console.log("User", req?.user);
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = role;
        const updatedUser = await user.save();


        res.status(200).json({ message: "User role updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
