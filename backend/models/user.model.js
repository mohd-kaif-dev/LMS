import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    googleId: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student'
    },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    bio: { type: String },
    completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    totalCourses: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    totalHoursWatched: { type: Number, default: 1 },
    totalRevenue: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numRatings: { type: Number, default: 0 },

    isVerified: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre('insertMany', async function (next, docs) {
    for (let doc of docs) {
        const salt = await bcrypt.genSalt(10);
        doc.password = await bcrypt.hash(doc.password, salt);
    }
    next();
});


userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
