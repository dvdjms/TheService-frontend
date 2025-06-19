import { fetchRequest } from './config';


export const getUsers = () => {
    return fetchRequest('/users');
}

export const getUser = (id: string) => {
    return fetchRequest(`/users/${id}`)
}

export const updateUser = (id: string, data: any) => {
    return fetchRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

export const createUser = (data: any) => {
    return fetchRequest('/users', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}


export const deleteUser = (id: string) => {
    return fetchRequest(`/users/${id}`, {
        method: 'DELETE',
    });
}
