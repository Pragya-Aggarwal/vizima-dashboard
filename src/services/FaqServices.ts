import api from "../lib/axiosInstance";

export const getFaqs = async (data: any) => {
    const queryParams = new URLSearchParams();
    if (data.page) queryParams.append("page", data.page.toString());
    if (data.limit) queryParams.append("limit", data.limit.toString());
    let response = await api.get(`/api/faqs?${queryParams.toString()}`)
    return response.data;
};


// add property
export const addFaq= async (data: any) => {
    let response = await api.post(`/api/faqs`, data);
    return response.data;
};


export const deleteFaqbyId = async (id: string) => {
    const response = await api.delete(`/api/faqs/${id}`,);
    return response.data;
};



export const getFaqById = async (id: string) => {

    let response = await api.get(`/api/faqs/${id}`)
    return response.data;
};


export const updateFaqById = async (id: string, data: any) => {
    let response = await api.put(`/api/faqs/${id}`, data)

    return response.data;
};

