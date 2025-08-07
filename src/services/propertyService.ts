import api from "../lib/axiosInstance";

export const getPropertiesfullInquiries = async (data: any) => {
    const queryParams = new URLSearchParams();
    if (data.page) queryParams.append("page", data.page.toString());
    if (data.limit) queryParams.append("limit", data.limit.toString());
    if (data.city) queryParams.append("city", data.city);
    if (data.state) queryParams.append("state", data.state);
    if (data.sharingType) queryParams.append("sharingType", data.sharingType);
    if (data.minPrice) queryParams.append("minPrice", data.minPrice.toString());
    if (data.maxPrice) queryParams.append("maxPrice", data.maxPrice.toString());
    if (data.bedrooms) queryParams.append("bedrooms", data.bedrooms.toString());
    if (data.bathrooms) queryParams.append("bathrooms", data.bathrooms.toString());
    if (data.search) queryParams.append("search", data.search);
    if (data.isAvailable) queryParams.append("isAvailable", data.isAvailable);
    if (data.isFeatured) queryParams.append("isFeatured", data.isFeatured);
    if (data.type) queryParams.append("type", data.type);
    if (data.sharingType) queryParams.append("sharingType", data.sharingType);
    if (data.sortOrder) queryParams.append("sortOrder", data.sortOrder);
    if (data.sortBy) queryParams.append("sortBy", data.sortBy);
    if (data.amenities) queryParams.append("amenities", data.amenities);
    if (data.microSiteLink) queryParams.append("microSiteLink", data.microSiteLink);
    let response = await api.get(`/api/properties?${queryParams.toString()}`)
    return response.data;
};

// add property
export const addProperty = async (data: any) => {
    let response = await api.post(`/api/properties`, data);
    return response.data;
};


export const deletePropertybyId = async (id: string) => {
    const response = await api.delete(`/api/properties/${id}`,);
    return response.data;
};



export const getPropertyById = async (id: string) => {

    let response = await api.get(`/api/properties/${id}`)
    return response.data;
};


export const updatePropertyById = async (id: string, data: any) => {
    let response = await api.put(`/api/properties/${id}`, data)

    return response.data;
};


export const getPropertyStats = async () => {
    let response = await api.get(`/api/properties/stats`);
    return response.data;
};

export const deleteMultipleProperties = async (ids: string[]) => {
    let response = await api.delete(`/api/properties/delete-multiple`, {
        data: { propertyIds: ids }
    });
    return response.data;
};




