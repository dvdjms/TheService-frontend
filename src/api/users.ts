import { fetchRequest } from './base';


export const getUser = (id: string, accessToken: string) => {
    return fetchRequest(`/users/${id}`, accessToken)
}

export const updateUser = (id: string, accessToken: string, data: any) => {
    return fetchRequest(`/users/${id}`, accessToken, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

