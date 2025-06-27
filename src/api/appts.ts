import { fetchRequest } from './base';

export const createAppointment = async (accessToken: string | null, data: any) => {
    if (!accessToken) throw new Error('Access token required');
    console.log("data", data)
    return await fetchRequest('appointments', accessToken, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export const getAllAppointments = async (userId: string, accessToken: string) => {
    return await fetchRequest(`appointments?userId=${userId}`, accessToken);
}


export const getAppointment = async (userId: string, clientId: string, apptId: string, accessToken: string) => {
    return await fetchRequest(`/appointments/${apptId}?userId=${userId}&clientId=${clientId}`, accessToken);
}



export const updateAppointment = async (userId: string, clientId: string, apptId: string, accessToken: string, data: any) => {
    return await fetchRequest(`/appointments/${apptId}?userId=${userId}&clientId=${clientId}`, accessToken, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}




export const deleteAppointment = (userId: string, clientId: string, apptId: string, accessToken: string, data: any) => {
    return fetchRequest(`/appointments/${apptId}?userId=${userId}&clientId=${clientId}`, accessToken, {
        method: 'DELETE',
    });
}

