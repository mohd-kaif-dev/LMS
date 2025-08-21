import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Lesson title is required"],
        trim: true,
        minlength: [3, "Lesson title must be at least 3 characters"],
    },
    videoUrl: {
        type: String,
        validate: {
            validator: (url) => {
                try {
                    new URL(url);
                    return true;
                } catch (error) {
                    return false;
                }
            },
            message: "Invalid video URL",
        },
    },
    videoPublicId: {
        type: String,
        trim: true,
    },
    duration: {
        type: Number,
        min: [0, "Duration must be at least 0 seconds"],
    },
    description: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

const sectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Section title is required"],
        trim: true,
        minlength: [3, "Section title must be at least 3 characters"],
    },
    lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
    {
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Instructor is required"],
        },
        title: {
            type: String,
            required: [true, "Course title is required"],
            trim: true,
            minlength: [3, "Course title must be at least 3 characters"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            minlength: [3, "Category must be at least 3 characters"],
        },
        description: {
            type: String,
            trim: true,
        },
        dificulty: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            default: "beginner",
        },
        thumbnailUrl: {
            type: String,
            validate: {
                validator: (url) => {
                    try {
                        new URL(url);
                        return true;
                    } catch (error) {
                        return false;
                    }
                },
                message: "Invalid thumbnail URL",
            },
        },
        thumbnailPublicId: {
            type: String,
            trim: true,
        },
        sections: [sectionSchema],
        price: {
            type: Number,
            default: 0,
            min: [0, "Price must be at least 0"],
        },
        originalPrice: {
            type: Number,
            default: 999,
            min: [0, "Original price must be at least 0"],
        },
        progress: {
            type: Number,
            default: 10,
            min: [0, "Progress must be at least 0"],
            max: [100, "Progress must be at most 100"],
        },
        status: {
            type: String,
            enum: {
                values: ["draft", "published"],
                message: "Status must be either 'draft' or 'published'",
            },
            default: "draft",
        },
        published: {
            type: Boolean,
            default: false,
        },
        requirements: [String],
        learningOutcomes: [String],
        totalDuration: {
            type: Number,
            default: 0,
        },
        studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        rating: {
            type: Number,
            default: 0,
            min: [0, "Rating must be at least 0"],
            max: [5, "Rating must be at most 5"],
        },
        numReviews: {
            type: Number,
            default: 0,
        },

        detailedDescription: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

courseSchema.index({ title: "text", description: "text" });

const Course = mongoose.model("Course", courseSchema);

export default Course;

