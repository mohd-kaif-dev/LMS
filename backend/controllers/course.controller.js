import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";


import fs from "fs";
import { uploadBufferToCloudinary } from "../utils/Helper.js"; // or define above in this file


// Step 1: Create a draft course
export const createCourseDraft = async (req, res) => {
    try {
        const { title, category } = req.body;

        if (!title || !category) {
            return res.status(400).json({ message: "Title and category are required" });
        }

        const course = await Course.create({
            title,
            category,
            instructor: req.user.userId,
            status: "draft",
        });

        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Step 2+: Update course draft (add more details)
export const updateCourseDraft = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const course = await Course.findOneAndUpdate(
            { _id: id, instructor: req.user.userId },
            { $set: updates },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found or not yours" });
        }

        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const togglePublishCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findOneAndUpdate(
            { _id: id, instructor: req.user.userId },
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found or not yours" });
        }

        course.status = course.status === "draft" ? "published" : "draft";
        course.published = !course.published; // toggle published status
        await course.save();

        res.json({ message: `Course ${course.status === "published" ? "published" : "unpublished"} successfully`, course });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all courses (admin only or public listing)
export const getAllCourses = async (req, res) => {
    try {
        const { category = "", page = 1, limit = 10, searchTerm } = req.query;

        // ----- COURSE QUERY -----
        const courseQuery = {};
        if (category) courseQuery.category = category;

        if (searchTerm) {
            courseQuery.$or = [
                { title: { $regex: searchTerm, $options: "i" } },
                { description: { $regex: searchTerm, $options: "i" } },
                { category: { $regex: searchTerm, $options: "i" } },
            ];
        }
        const courses = await Course.find(courseQuery)
            .populate("instructor", "name email")
            .limit(Number(limit))
            .skip(Number(limit) * (page - 1));

        // ----- INSTRUCTOR QUERY -----
        let instructors = [];
        if (searchTerm) {
            instructors = await User.find({
                role: "instructor",
                name: { $regex: searchTerm, $options: "i" },
            })
                .select("name email profilePicture") // only select needed fields
                .limit(5);
        }


        res.json({ courses, instructors });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }


};



// Get single course by ID
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate("instructor", "name email");
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update course
export const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) return res.status(404).json({ message: "Course not found" });

        if (
            req.user.role !== "admin" &&
            course.instructor.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Not authorized to update this course" });
        }

        Object.assign(course, req.body);
        await course.save();

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Enroll in course
export const enrollInCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) return res.status(404).json({ message: "Course not found" });

        if (!course.studentsEnrolled.includes(req.user.userId)) {
            course.studentsEnrolled.push(req.user.userId);
            await course.save();
        }

        res.json({ message: "Enrolled successfully", course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get enrolled courses for a user
export const getMyEnrolledCourses = async (req, res) => {
    try {
        console.log("inside here", req.user._id)
        const userId = req.user._id;
        const courses = await Course.find({ studentsEnrolled: userId }).populate("instructor", "name email");
        res.json(courses);
    } catch (error) {
        console.log("Error in getMyEnrolledCourses controller: ", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete course (Instructor or Admin)
export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findOneAndDelete({
            _id: req.params.id,
            instructor: req.user.userId
        });

        if (!course) {
            return res.status(404).json({ message: "Course not found or not yours" });
        }

        res.json({ message: "Course deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Upload course thumbnail
export const uploadCourseThumbnail = async (req, res) => {
    try {

        const courseId = req.params.courseId; // matches route
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Upload buffer to Cloudinary (image)
        const result = await uploadBufferToCloudinary(req.file.buffer, "lms_thumbnails", "image");

        // If previous thumbnail exists, delete it
        if (course.thumbnailPublicId) {
            try {
                await cloudinary.uploader.destroy(course.thumbnailPublicId);
            } catch (e) {
                console.warn("Failed removing old thumbnail:", e.message);
            }
        }

        course.thumbnailUrl = result.secure_url;
        course.thumbnailPublicId = result.public_id;
        await course.save();

        res.json({ message: "Thumbnail uploaded", course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload failed", error: err.message });
    }
};

// Upload lesson video
export const uploadLessonVideo = async (req, res) => {
    try {
        const { courseId, sectionId, lessonId } = req.params;
        const { title, description, duration } = req.body;
        if (!req.file) return res.status(400).json({ message: "No video file uploaded" });

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "lms_videos",
            resource_type: "video",
        });

        fs.unlinkSync(req.file.path);

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const section = course.sections.id(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });

        let lesson = section.lessons.id(lessonId);
        if (!lesson) {
            lesson = section.lessons.create({ title, description, duration });
            section.lessons.push(lesson);
        }

        // delete previous video if exists
        if (lesson.videoPublicId) {
            try {
                await cloudinary.uploader.destroy(lesson.videoPublicId, { resource_type: "video" });
            } catch (e) {
                console.warn("Failed deleting previous video:", e.message);
            }
        }

        lesson.videoUrl = uploadResult.secure_url;
        lesson.videoPublicId = uploadResult.public_id;
        await course.save();

        res.json({ message: "Lesson video uploaded", lesson });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload failed", error: err.message });
    }
};

// Delete lesson video
export const deleteLessonVideo = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        let lessonFound = null;
        course.sections.forEach(async section => {
            const lesson = section.lessons.id(lessonId);
            if (lesson && lesson.videoUrl) {
                const publicId = lesson.videoUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`videos/${publicId}`, { resource_type: "video" });
                lesson.videoUrl = null;
                lessonFound = lesson;
            }
        });

        if (!lessonFound) {
            return res.status(404).json({ message: 'Lesson not found or no video' });
        }

        await course.save();
        res.json({ message: 'Video deleted', lesson: lessonFound });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed', error: error.message });
    }
};

// Add lesson with video
export const addLessonWithVideo = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { sectionId, title, description, duration } = req.body;

        if (!req.file) return res.status(400).json({ message: "No video file uploaded" });

        // Upload temp file to Cloudinary as video
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "lms_videos",
            resource_type: "video",
        });

        // remove temp file
        fs.unlinkSync(req.file.path);

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Find section
        const section = course.sections.id(sectionId);
        if (!section) return res.status(404).json({ message: "Section not found" });

        const newLesson = {
            title,
            description,
            duration: duration ? Number(duration) : undefined,
            videoUrl: result.secure_url,
            videoPublicId: result.public_id,
        };

        section.lessons.push(newLesson);
        await course.save();

        res.json({ message: "Lesson added with video", course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload failed", error: err.message });
    }
};


export const getInstructorAllCourses = async (req, res) => {
    try {
        const instructor = req.user._id;

        const courses = await Course.find({ instructor }).populate("instructor", "name");
        res.json(courses);

    } catch (error) {
        console.log("Error in getInstructorCourses controller: ", error);
        res.status(500).json({ message: "Failed to fetch courses", error: error.message });
    }
}