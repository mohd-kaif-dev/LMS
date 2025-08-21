import { create } from "zustand"
import axios from "axios"
import { toast } from "sonner"

const BASE_URL = import.meta.env.VITE_BACKEND_URL

const courseStore = (set) => ({
    courses: [],
    instructors: [],
    selectedCourse: null,
    isFetching: false,
    fetchCourses: async ({ category, limit, searchTerm }) => {
        try {
            set({ isFetching: true });
            const res = await axios.get(`${BASE_URL}/api/courses?category=${category || ""}&limit=${limit || 10}&searchTerm=${searchTerm || ""}`);
            const data = await res.data
            set({
                courses: data.courses || [],
                instructors: data.instructors || [],
            });
            return data
        } catch (error) {
            console.log("Error Fetching courses", error);
            toast.error("Failed to fetch courses");
        } finally {
            set({ isFetching: false });
        }
    },
    fetchCourseById: async (courseId) => {
        try {

            set({ isFetching: true });
            const res = await axios.get(`${BASE_URL}/api/courses/${courseId}`);
            const data = await res.data

            set({ selectedCourse: data });
        } catch (error) {
            console.log("Error Fetching course", error);
            toast.error("Failed to fetch course");
        } finally {
            set({ isFetching: false });
        }
    },
    fetchInstructorsCourses: async () => {
        try {
            set({ isFetching: true });
            const res = await axios.get(`${BASE_URL}/api/courses/instructor`, {
                withCredentials: true
            });
            const data = await res.data
            console.log("data", data)
            set({ courses: data || [] });
        } catch (error) {
            console.log("Error Fetching Instructors courses", error);
            toast.error("Failed to fetch Instructors courses");
        } finally {
            set({ isFetching: false });
        }
    },
    fetchStudentEnrolledCourses: async () => {
        try {
            set({ isFetching: true });
            const res = await axios.get(`${BASE_URL}/api/courses/my/enrollments`, {
                withCredentials: true
            });
            const data = await res.data
            console.log("data", data)
            set({ courses: data || [] });
        } catch (error) {
            console.log("Error Fetching enrolled courses", error);
            toast.error("Failed to fetch enrolled courses");
        } finally {
            set({ isFetching: false });
        }
    },
    createCourse: async (data) => {
        const res = await axios.post(`${BASE_URL}/api/courses`, data);
        const course = await res.json();
        set({ courses: [...course, course] });
    }
})

const useCourseStore = create(courseStore);



export default useCourseStore;