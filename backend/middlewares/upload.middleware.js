import multer from "multer";
import path from "path";
import fs from "fs";

// IMAGE UPLOAD — memory (small files like thumbnails)
const memoryStorage = multer.memoryStorage();

export const uploadImage = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB for thumbnails
});

// VIDEO UPLOAD — disk (safer for large files)
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadVideo = multer({
  storage: diskStorage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // up to 1GB - adjust as needed
});
