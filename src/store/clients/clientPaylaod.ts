import { Client } from "../../components/types/Service";


export const createFullClient = (data: {
    userId: string;
    clientId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    notes?: string;
    address1?: string;
    address2?: string;
    city?: string;
    stateOrProvince?: string;
    postalCode?: string;
    countryCode?: string;
    createdAt?: string;
    updatedAt?: string;

    }): Client => {

    return {
        PK: `USER#${data.userId}`,
        SK: `#CLIENT#${data.clientId}`,
        clientId: data.clientId,
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone || '',
        notes: data.notes || '',
        address1: data.address1 || '',
        address2: data.address2 || '',
        city: data.city || '',
        stateOrProvince: data.stateOrProvince || '',
        postalCode: data.postalCode || '',
        countryCode: data.countryCode || '',
        lng: 0,
        lat: 0,
        type: 'Client',
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
    };
};
