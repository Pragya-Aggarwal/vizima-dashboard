import api from "../lib/axiosInstance";

export const AuthServices = {

    //  Sign-up API call
    signUp: async (data: {
        email: string;
        password: string;
        confirmPassword: string;
        name: string;
        phone: string;
    }) => {
        console.log(data);
        const response = await api.post("/api/v1/auth/sign-up", data);
        console.log(response.data);
        return response.data;
    },

    //  otp Verify 
    verifyOTP: async (data: { email: string; otp: string }) => {
        const response = await api.post("/api/v1/auth/verify-otp", data);
        console.log("Response from verifyOTP:", response.data);
        return response.data;
    },
    reSendVerifyOTP: async (data: { email: string; }) => {
        const response = await api.post("/api/v1/auth/resend-otp", data);
        console.log("Response from verifyOTP:", response.data);
        return response.data;
    },

    //  Login API call
    login: async (data: {
        name: string;
        email: string;
        phone: string;
        role: string;
        password: string;
    }) => {
        const response = await api.post("/api/auth/login", data);
        return response.data;
    },

    //  Refresh Token API call
    refreshToken: async (data: { refreshToken: string }) => {
        const response = await api.post("/api/v1/auth/refresh-token", data);
        return response.data;
    },

    //  Fetch User Profile API call
    getUserProfile: async () => {
        const response = await api.get("/api/v1/auth/me");
        return response.data;
    },

    logout: async () => {
        const response = await api.post("/api/auth/logout");
        return response.data;
    },


};
