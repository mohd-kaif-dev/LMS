import axios from 'axios';
import { toast } from 'sonner';
import { create } from 'zustand';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const useAdminStore = create((set, get) => ({
    isFetching: false,
    isDeleting: false,
    adminUsers: [],
    adminCourses: [],
    pagination: {
        page: 1,
        limit: 10,
        total: 0, // ✅ Add total for pagination
        setPage: (page) =>
            set((state) => ({
                pagination: { ...state.pagination, page },
            })),
        setLimit: (limit) =>
            set((state) => ({
                pagination: { ...state.pagination, limit },
            })),
    },

    // @desc    Get all users
    getAllUsers: async () => {
        try {
            set({ isFetching: true });
            const { page, limit } = get().pagination;
            const { data } = await axios.get(
                `${BASE_URL}/api/admin/users?page=${page}&limit=${limit}`,
                { withCredentials: true }
            );
            set({ adminUsers: data.users, isFetching: false });
            return { success: true };
        } catch (error) {
            console.log('Error in getAllUsers: ', error);
            toast.error('Failed to fetch Users');
            set({ isFetching: false });
            return { success: false };
        }
    },

    // @desc    Get all courses
    getAllCourses: async (page = get().pagination.page, limit = get().pagination.limit, searchQuery = '') => {
        try {
            console.log("Page: ", page)
            set({ isFetching: true });
            const { data } = await axios.get(
                `${BASE_URL}/api/admin/courses?page=${page}&limit=${limit}&searchQuery=${searchQuery}`,
                { withCredentials: true }
            );
            set({
                adminCourses: data.courses,
                pagination: {
                    ...get().pagination,
                    page: data.pagination.page,
                    limit: data.pagination.limit,
                    total: data.pagination.total,
                },
                isFetching: false,
            });
            console.log("data-pagination: ", data.pagination)
        } catch (error) {
            console.log('Error in getAllCourses: ', error);
            set({ isFetching: false });
        }
    },

    // @desc    Delete a user
    deleteUser: async (id) => {
        try {
            set({ isDeleting: true });
            await axios.delete(`${BASE_URL}/api/admin/users/${id}`, { withCredentials: true });
            set({ isDeleting: false });
            toast.success('User deleted successfully');
            get().getAllUsers();
        } catch (error) {
            console.log('Error in deleteUser: ', error);
            toast.error('Failed to delete user');
            set({ isDeleting: false });
        }
    },

    // @desc    Delete a course
    deleteCourse: async (id) => {
        try {
            set({ isDeleting: true });
            await axios.delete(`${BASE_URL}/api/admin/courses/${id}`, { withCredentials: true });
            set({ isDeleting: false });
            toast.success('Course deleted successfully');
            const { page, limit } = get().pagination;
            get().getAllCourses(page, limit); // ✅ Refetch current page
        } catch (error) {
            console.log('Error in deleteCourse: ', error);
            set({ isDeleting: false });
        }
    },
}));
