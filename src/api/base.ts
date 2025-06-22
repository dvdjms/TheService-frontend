import { getUserSession } from "../lib/auth/cognitoService";

const API_BASE_URL = process.env.API_BASE_URL;

export const fetchRequest = async (
    path: string,
    options: RequestInit = {}
): Promise<any> => {
    console.log("api options", options)
    const { accessToken } = await getUserSession();

    // return // until backend sorted
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
