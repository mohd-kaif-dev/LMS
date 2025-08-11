import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String },
    videoPublicId: { type: String }, // store Cloudinary public_id
    duration: { type: Number },
    description: { type: String },
}, { timestamps: true });

const sectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
    {
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String },
        thumbnailUrl: { type: String },        // Cloudinary URL
        thumbnailPublicId: { type: String },   // Cloudinary public_id
        sections: [sectionSchema],
        price: { type: Number, default: 0 },
        status: { type: String, enum: ["draft", "published"], default: "draft" },
        published: { type: Boolean, default: false },
        requirements: [String],
        learningOutcomes: [String],
        studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
