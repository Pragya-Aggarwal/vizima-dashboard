import api from "../lib/axiosInstance";

export const getTestimonial = async (data: any) => {
    const queryParams = new URLSearchParams();
    if (data.page) queryParams.append("page", data.page.toString());
    if (data.limit) queryParams.append("limit", data.limit.toString());
    let response = await api.get(`/api/testimonials?${queryParams.toString()}`)
    return response.data;
};

// add property
export const addTestimonial= async (data: any) => {
    let response = await api.post(`/api/testimonials`, data);
    return response.data;
};


export const deleteTestimonialbyId = async (id: string) => {
    const response = await api.delete(`/api/testimonials/${id}`,);
    return response.data;
};



export const getTestimonialById = async (id: string) => {

    let response = await api.get(`/api/testimonials/${id}`)
    return response.data;
};


export const updateTestimonialById = async (id: string, data: any) => {
    let response = await api.put(`/api/testimonials/${id}`, data)

    return response.data;
};

