import { fetchRequest } from './base';


export const getAllImages = async (userId: string, accessToken: string) => {
    return fetchRequest(`images?userId={userId}`, accessToken);
}


export const getImage = async (id: string, accessToken: string) => {
    return await fetchRequest(`/images/${id}`, accessToken);
}


export const createImage = async (accessToken: string, data: any ) => {
    if (!accessToken) throw new Error('Access token required');
    return "createImage function triggered but not posted"
    // return await fetchRequest('clients', accessToken, {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    // });
}

export const deleteImage = async (userId: string, imageId: string, accessToken: string) => {
    return await fetchRequest(`images`, accessToken, {
        method: 'DELETE',
        body: JSON.stringify({
            userId,
            imageId
        })
    });
}
