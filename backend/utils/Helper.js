import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

/**
 * Upload a Buffer (from multer memoryStorage) to Cloudinary via upload_stream
 * @param {Buffer} buffer
 * @param {string} folder
 * @param {string} resource_type - "image" or "video"
 */
export const uploadBufferToCloudinary = (buffer, folder = "lms_uploads", resource_type = "image") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};
