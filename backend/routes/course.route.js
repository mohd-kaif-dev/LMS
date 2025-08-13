import express from "express";
import {
    createCourseDraft,
    updateCourseDraft,
    getAllCourses,
    getCourseById,
    deleteCourse,
    togglePublishCourse,
    enrollInCourse,
    getMyEnrolledCourses,
    uploadCourseThumbnail,
    uploadLessonVideo,
    deleteLessonVideo,
    getInstructorAllCourses
} from "../controllers/course.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadImage, uploadVideo } from "../middlewares/upload.middleware.js";


const router = express.Router();

//------ Public
router.get("/", getAllCourses);
// Get single course
router.get("/:id", getCourseById);

//----- Protected
// Create draft (Step 1)
router.post("/", protect, createCourseDraft);

// Update draft (Step 2+)
router.patch("/:id", protect, updateCourseDraft);

router.put("/:id/publish", protect, togglePublishCourse);

// Delete course
router.delete("/:id", protect, deleteCourse);

router.post("/:id/enroll", protect, enrollInCourse);

router.get("/my/enrollments", protect, getMyEnrolledCourses);

router.put('/:courseId/thumbnail', protect, uploadImage.single('thumbnail'), uploadCourseThumbnail);

router.put('/:courseId/sections/:sectionId/lessons', protect, uploadVideo.single('video'), uploadLessonVideo);

router.delete('/:courseId/sections/:sectionId/lessons/:lessonId', protect, deleteLessonVideo);

router.get("/", protect, getInstructorAllCourses);

export default router;