import connectDB from "./config/connectDB.js"
import { instructorData } from "./data/userData.js";
import { courseData } from "./data/CourseData.js";
import User from "./models/user.model.js";
import Course from "./models/course.model.js";

import dotenv from "dotenv";
dotenv.config();

const seedData = async () => {
    try {
        // Connect to the database
        await connectDB();

        // Clear existing users and courses to prevent duplicates on each run
        await User.deleteMany({});
        await Course.deleteMany({});
        console.log("Existing users and courses cleared.");

        // Seed admin user first
        const adminUser = {
            name: "Admin",
            email: "admin@test.com",
            password: "12345678",
            role: "admin",
            isVerified: true,
        };
        await User.create(adminUser);
        console.log("Admin user seeded successfully!");

        // Insert the instructor data and get the created documents to access their IDs
        const instructors = await User.insertMany(instructorData);
        console.log("Instructor data seeded successfully!");

        // Prepare a list of courses to seed
        const coursesToSeed = [];

        // Loop through each instructor and assign them at least 10 unique courses
        let assignedCourses = []; // Keep track of courses assigned to instructors
        courseData.forEach((baseCourse) => {
            const randomIndex = Math.floor(Math.random() * instructors.length);
            const instructor = instructors[randomIndex];
            if (!assignedCourses.includes(baseCourse.title)) {
                const newCourse = {
                    ...baseCourse,
                    instructor: instructor._id, // Assign the instructor's ObjectId
                };
                coursesToSeed.push(newCourse);
                assignedCourses.push(baseCourse.title);
            }
        });

        // Insert all the newly generated course data
        await Course.insertMany(coursesToSeed);
        console.log("Course data seeded successfully!");

        // Exit the process
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();

