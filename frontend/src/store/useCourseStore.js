import { create } from "zustand"
import axios from "axios"
import { toast } from "sonner"

const BASE_URL = import.meta.env.VITE_BACKEND_URL

const courseStore = (set) => ({
    courses: [],
    instructors: [],
    selectedCourse: null,
    isFetching: false,
    isLoading: false,
    isUploading: false,
    isPublishing: false,
    isDeleting: false,
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
            console.log("courseIDD", courseId)
            set({ isFetching: true });
            const res = await axios.get(`${BASE_URL}/api/courses/${courseId}`);
            const data = await res.data
            console.log("data", data)
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
    createDraft: async (data) => {
        try {
            set({ isLoading: true });
            const res = await axios.post(`${BASE_URL}/api/courses`, data, {
                withCredentials: true
            });
            const course = await res.data.course
            console.log("Res", res)
            set({ selectedCourse: course });
            return { success: true, course }
        } catch (error) {
            console.log("Error Creating course", error);
            toast.error("Failed to create course");
            return { success: false, course: null }
        } finally {
            set({ isLoading: false });
        }
    },
    updateDraft: async (courseId, data) => {
        try {
            set({ isLoading: true });
            const res = await axios.put(`${BASE_URL}/api/courses/${courseId}`, data, {
                withCredentials: true
            });
            const course = await res.data.course
            set({ selectedCourse: course });
            return { success: true, course }
        } catch (error) {
            console.log("Error Updating course", error);
            toast.error("Failed to update course");
        } finally {
            set({ isLoading: false });
        }
    },
    uploadVideoLesson: async (courseId, sectionId, lessonId, file, onProgressCallback) => {
        try {
            set({ isUploading: true });

            // 1. Create a FormData object to send the file
            const formData = new FormData();
            formData.append('video', file);

            // 2. Make the axios call with the file and the progress tracker
            const res = await axios.put(
                `${BASE_URL}/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/video`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        // This header is crucial for file uploads with FormData
                        'Content-Type': 'multipart/form-data',
                    },
                    // 3. This is the key: Track progress and call the function from your component
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        // If a callback was provided, call it with the new percentage
                        if (onProgressCallback) {
                            onProgressCallback(percentCompleted);
                        }
                    },
                }
            );

            const { course, lesson } = await res.data;
            set({ selectedCourse: course });
            toast.success("Video uploaded!");
            return { success: true, course, lesson };

        } catch (error) {
            console.log("Error uploading video", error);
            toast.error("Video upload failed.");
            // Reset the progress bar in the UI on failure
            if (onProgressCallback) {
                onProgressCallback(0);
            }
            return { success: false };
        } finally {
            set({ isUploading: false });
        }
    },
    addCourseThumbnail: async (courseId, file) => {

        try {
            set({ isUploading: true });
            // 1. Create a FormData object
            const formData = new FormData();

            // 2. Append the file with a specific key.
            // This key 'thumbnail' MUST match what your backend is expecting.
            formData.append('thumbnail', file);
            const res = await axios.put(`${BASE_URL}/api/courses/${courseId}/thumbnail`, formData, {
                withCredentials: true
            });
            const course = await res.data.course
            set({ selectedCourse: course });
            return { success: true, course }
        } catch (error) {
            console.log("Error Adding course thumbnail", error);
            toast.error("Failed to add course thumbnail");
            return { success: false, course: null }
        } finally {
            set({ isUploading: false });
        }
    },
    togglePublishCourse: async (courseId) => {
        try {
            set({ isPublishing: true });
            const res = await axios.put(`${BASE_URL}/api/courses/${courseId}/publish`, {}, {
                withCredentials: true
            });
            const course = await res.data.course
            set({ selectedCourse: course });
            return { success: true, course }
        } catch (error) {
            console.log("Error toggling publish course", error);
            toast.error("Failed to toggle publish course");
            return { success: false, course: null }
        } finally {
            set({ isPublishing: false });
        }
    },
    deleteCourse: async (courseId) => {
        try {
            set({ isDeleting: true });
            const res = await axios.delete(`${BASE_URL}/api/courses/${courseId}`, {
                withCredentials: true
            });
            toast.success(res.data.message || "Course deleted successfully");
            set({ selectedCourse: null });
            return { success: true }
        } catch (error) {
            console.log("Error deleting course", error);
            toast.error("Failed to delete course");
            return { success: false, course: null }
        } finally {
            set({ isDeleting: false });
        }
    },
})

const useCourseStore = create(courseStore);



export default useCourseStore;