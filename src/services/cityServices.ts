import api from "../lib/axiosInstance";

export const getCities = async (data: any) => {
    const queryParams = new URLSearchParams();
    if (data.page) queryParams.append("page", data.page.toString());
    if (data.limit) queryParams.append("limit", data.limit.toString());
    let response = await api.get(`/api/cities?${queryParams.toString()}`)
    return response.data;
};

// add property
export const addcity= async (data: any) => {
    let response = await api.post(`/api/cities`, data);
    return response.data;
};


export const deleteCitybyId = async (id: string) => {
    const response = await api.delete(`/api/cities/${id}`,);
    return response.data;
};



export const getCityById = async (id: string) => {

    let response = await api.get(`/api/cities/${id}`)
    return response.data;
};


export const updateCityById = async (id: string, data: any) => {
    let response = await api.put(`/api/cities/${id}`, data)

    return response.data;
};

