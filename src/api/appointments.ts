import { fetchRequest } from './config';


export const getAppointments = () => {
    return fetchRequest('/appointments');
}

export const getAppointment = (id: string) => {
    return fetchRequest(`/appointments/${id}`);
}

export const updateAppointment = (id: string, data: any) => {
    return fetchRequest(`/appointments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export const createAppointment = async (data: any) => {
    return fetchRequest('/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}


export const deleteAppointment = (id: string) => {
    return fetchRequest(`/appointments/${id}`, {
        method: 'DELETE',
    });
}

