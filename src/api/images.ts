import { fetchRequest } from './config';


export const getImages = () => {
    return fetchRequest('/images');
}

export const getImage = (id: string) => {
    return fetchRequest(`/images/${id}`);
}

export const createImage = (data: any) => {
    return fetchRequest('/images', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export const deleteImage = (id: string) => {
    return fetchRequest(`/images/${id}`, {
        method: 'DELETE',
    });
}
