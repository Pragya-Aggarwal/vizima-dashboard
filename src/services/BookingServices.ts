import api from "../lib/axiosInstance";

export const getBookings = async (data: any) => {
    const queryParams = new URLSearchParams();
    if (data.page) queryParams.append("page", data.page.toString());
    if (data.limit) queryParams.append("limit", data.limit.toString());
    if (data.status) queryParams.append("status", data.status);
    if (data.paymentStatus) queryParams.append("paymentStatus", data.paymentStatus);
    if (data.property) queryParams.append("property", data.property);
    if (data.search) queryParams.append("search", data.search);
    let response = await api.get(`/api/bookings/admin?${queryParams.toString()}`)
    return response.data;
};


export const getBookingById = async (id: string) => {
    let response = await api.get(`/api/bookings/${id}`)
    return response.data;
};




// visitbooking

export const getVisitBookings = async (data: any) => {
    const queryParams = new URLSearchParams();
    if (data.page) queryParams.append("page", data.page.toString());
    if (data.limit) queryParams.append("limit", data.limit.toString());
    if (data.status) queryParams.append("status", data.status);
    if (data.paymentStatus) queryParams.append("paymentStatus", data.paymentStatus);
    if (data.property) queryParams.append("property", data.property);
    if (data.search) queryParams.append("search", data.search);
    let response = await api.get(`/api/visit-bookings?${queryParams.toString()}`)
    return response.data;
};


export const getVisitBookingById = async (id: string) => {
    let response = await api.get(`/api/visit-bookings/${id}`)
    return response.data;
};


// 
export const getBookingStats = async () => {
    let response = await api.get(`/api/bookings/admin/stats`)
    return response.data;
};






