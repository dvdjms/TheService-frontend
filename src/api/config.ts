import { getUserSession } from "../lib/auth/cognitoService";

const API_BASE_URL = 'https://your-api-id.region.amazonaws.com';

export const fetchRequest = async (
    path: string,
    options: RequestInit = {}
): Promise<any> => {

    const { accessToken } = await getUserSession();

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            ...(options.headers || {}),
        },
    });

    let responseBody: any;
    
    try {
        responseBody = await res.json();
    } catch {
        responseBody = null
    }

    if (!res.ok) {
        const message = responseBody?.message || res.statusText || 'Unknown API error';
        throw new Error(message);
    }
    return responseBody;
};
