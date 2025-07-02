import api from "../lib/axiosInstance";

export const getBanners = async (data: any) => {
    const queryParams = new URLSearchParams();
    if (data.page) queryParams.append("page", data.page.toString());
    if (data.limit) queryParams.append("limit", data.limit.toString());
    let response = await api.get(`/api/banners?${queryParams.toString()}`)
    return response.data;
};

// add property
export const addBanner= async (data: any) => {
    let response = await api.post(`/api/banners`, data);
    return response.data;
};


export const deleteBanner = async (id: string) => {
    const response = await api.delete(`/api/banners/${id}`,);
    return response.data;
};



export const getBannerById = async (id: string) => {

    let response = await api.get(`/api/banners/${id}`)
    return response.data;
};


export const updateBannerById = async (id: string, data: any) => {
    let response = await api.put(`/api/banners/${id}`, data)

    return response.data;
};

