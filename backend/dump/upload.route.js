// import express from "express";
// import { upload } from "../middlewares/upload.middleware.js";
// import cloudinary from "../config/cloudinary.js";
// import fs from "fs";

// const router = express.Router();

// // Upload route (supports image & video)
// router.post("/upload", upload.single("file"), async (req, res) => {
//     try {
//         if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//         // detect file type
//         const fileType = req.file.mimetype.startsWith("video") ? "video" : "image";

//         const result = await cloudinary.uploader.upload(req.file.path, {
//             folder: "lms_uploads",
//             resource_type: fileType,
//         });

//         fs.unlinkSync(req.file.path); // remove temp file
//         res.json({ url: result.secure_url, public_id: result.public_id });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Delete file route
// router.delete("/delete/:publicId", async (req, res) => {
//     try {
//         const { publicId } = req.params;

//         // Detect if it's video or image by naming convention or pass via query
//         const resourceType = req.query.type || "image"; // default image

//         const result = await cloudinary.uploader.destroy(publicId, {
//             resource_type: resourceType,
//         });

//         res.json({ result });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: err.message });
//     }
// });

// export default router;