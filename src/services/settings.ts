import axios from "@/src/lib/axiosInstance";

export async function updateSettings(id: string, data: any) {
    return axios.put(`/api/settings/${id}`, data);
}

export async function getSettings() {
    return axios.get("/api/settings");
} 
