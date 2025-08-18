import { create } from "zustand"
import axios from "axios"
import { toast } from "sonner"

const BASE_URL = import.meta.env.VITE_BACKEND_URL

const courseStore = (set) => ({
    courses: [],
    isFetching: false,
    fetchCourses: async ({ category }) => {
        try {
            set({ isFetching: true });
            const res = await axios.get(`${BASE_URL}/api/courses?category=${category}`);
            const data = await res.data
            set({ courses: data });
        } catch (error) {
            console.log("Error Fetching courses", error);
            toast.error("Failed to fetch courses");
        } finally {
            set({ isFetching: false });
        }
    },
    fetchCourseById: async (id) => {
        try {
            set({ isFetching: true });
            const res = await axios.get(`${BASE_URL}/api/courses/${id}`);
            const data = await res.data
            set({ courses: data });
        } catch (error) {
            console.log("Error Fetching course", error);
            toast.error("Failed to fetch course");
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