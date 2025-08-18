import axios from "axios";


import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";


const BASE_API = import.meta.env.VITE_BACKEND_URL

export const useAuthStore = create(
    persist(
        (set) => ({
            authUser: null,
            isSigningUp: false,
            isSigningIn: false,
            isUpdatingProfile: false,
            isCheckingAuth: true,

            checkAuth: async () => {
                try {
                    const res = await axios.get(`${BASE_API}/api/auth/check`);
                    console.log("res store", res.data);
                    set({ authUser: res.data.user });
                } catch (error) {
                    console.log("Error in checkAuth: ", error);
                    set({ authUser: null });
                } finally {
                    set({ isCheckingAuth: false })
                }
            },
            signup: async (data) => {
                try {
                    set({ isSigningUp: true });
                    const res = await axios.post(`${BASE_API}/api/auth/signup`, data, {
                        withCredentials: true
                    });
                    console.log("res", res.data);
                    set({ authUser: res.data.user });
                    toast.success("Signup successful");
                } catch (error) {
                    console.log("Error in signup: ", error);
                    toast.error("Signup failed");
                } finally {
                    set({ isSigningUp: false });
                }
            },
            signin: async (data) => {
                try {
                    set({ isSigningIn: true });
                    const res = await axios.post(`${BASE_API}/api/auth/login`, data, {
                        withCredentials: true
                    });

                    set({ authUser: res.data.user });
                    toast.success("Logged In Successfully");
                    return { success: true }
                } catch (error) {
                    console.log("Error in SignIn: ", error);
                    toast.error("Log In failed");
                    return { success: false }
                } finally {
                    set({ isSigningIn: false });
                }
            },
            googleSignIn: () => {
                try {
                    set({ isSigningIn: true });
                    const googleLoginURL = `${BASE_API
                        }/api/auth/google`;
                    window.location.href = googleLoginURL;
                } catch (error) {
                    console.error("Google login error:", error);
                    toast.error("Google login failed");
                } finally {
                    set({ isSigningIn: false });
                }

            },
            getUser: async () => {
                try {
                    set({ isSigningIn: true })
                    const res = await axios.get(`${BASE_API}/api/auth/user`, { withCredentials: true })
                    set({ authUser: res.data.user })
                    return { success: true }
                } catch (error) {
                    set({ authUser: null })
                    console.log("Error Fetching User: ", error)
                    toast.error("Failed to fetch User")
                    return { success: false }
                } finally {
                    set({ isSigningIn: false })
                }
            },
            logout: async () => {
                try {
                    const res = await axios.post(`${BASE_API}/api/auth/logout`, {}, {
                        withCredentials: true
                    })
                    set({ authUser: null });
                    toast.success(res.data.message || "Logout successful");
                } catch (error) {
                    console.log("Error in logout: ", error);
                    toast.error("Logout failed");

                }
            },
            updateRole: async (role) => {
                try {
                    console.log("New role", role)
                    set({ isUpdatingProfile: true });
                    const res = await axios.put(`${BASE_API}/api/users/update-role`, { role: role }, {
                        withCredentials: true
                    });
                    console.log("res", res.data);
                    set({ authUser: res.data.user });
                    toast.success("Role Updated Successfully");
                } catch (error) {
                    console.log("Error in update-role: ", error);
                    toast.error("Update Role failed");
                } finally {
                    set({ isUpdatingProfile: false });
                }
            }
        }),
        {
            name: "auth-store",
            getStorage: () => sessionStorage,
        }
    )
)
