import api from "../lib/axiosInstance";


export const getUsers = async (data: any) => {
    const queryParams = new URLSearchParams();
    if (data.page) queryParams.append("page", data.page.toString());
    if (data.limit) queryParams.append("limit", data.limit.toString());

    // ✅ Fix: Add "?" before queryParams
    let response = await api.get(`/api/users?${queryParams.toString()}`);
    return response.data;
};

export const getUserById = async (id: string) => {

    let response = await api.get(`/api/users/${id}`)
    return response.data;
};

export const deleteUserbyId = async (id: string) => {
    const response = await api.delete(`/api/users/${id}`,);
    return response.data;
};


export const updateUserById = async (id: string, data: any) => {
    let response = await api.put(`/api/users/${id}`, data)

    return response.data;
};

