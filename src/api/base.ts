import Constants from 'expo-constants';


const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

console.log("API_BASE_URL",API_BASE_URL)


export const fetchRequest = async (
    path: string,
    accessToken: string,
    options: RequestInit = {}
): Promise<any> => {
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
