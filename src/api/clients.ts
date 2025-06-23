import { fetchRequest } from './base';


export const getAllClients = () => {
    return fetchRequest('/clients');
}

export const getClient = (id: string) => {
    return fetchRequest(`/clients/${id}`)
}

export const updateClient = (id: string, data: any) => {
    return fetchRequest(`/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

export const createClient = (data: any) => {
    return fetchRequest('/clients', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export const deleteClient = (id: string) => {
    return fetchRequest(`/clients/${id}`, {
        method: 'DELETE',
    });
}