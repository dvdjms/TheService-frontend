import { fetchRequest } from './base';


export const getAllClients = async (userId: string, accessToken: string) => {
    return await fetchRequest(`clients?userId=${userId}`, accessToken,);
}

export const getClient = async (userId: string, clientId: string, accessToken: string) => {
    return await fetchRequest(`clients/${clientId}?userId=${userId}`, accessToken)
}

export const updateClient = async (id: string, accessToken: string, data: any) => {
    return await fetchRequest(`clients/${id}`, accessToken, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

// works nicely
export const createClient = async (accessToken: string | null, data: any) => {
    if (!accessToken) throw new Error('Access token required');
    return await fetchRequest('clients', accessToken, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export const deleteClient = async (id: string, accessToken: string) => {
    return await fetchRequest(`clients/${id}`, accessToken, {
        method: 'DELETE',
    });
}