import User from "../models/user.model.js";

export const updateUserRole = async (req, res) => {

    const { role } = req.body;

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

export const updateUser = async (req, res) => {
    try {
        const { name, email, bio } = req.body;
        const updatedUser = await User.findOne(req.user._id);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        updatedUser.name = name;
        updatedUser.email = email;
        updatedUser.bio = bio;

        await updatedUser.save();

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}