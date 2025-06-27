import { fetchRequest } from './base';


export const getUserData = async (id: string, accessToken: string) => {
    return await fetchRequest(`/user-data?userId=${id}`, accessToken)
}

