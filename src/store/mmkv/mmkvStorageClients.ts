import { Client } from '../../components/types/Service';
import { storage } from './mmkv';



const CLIENTS_KEY = 'clients';

export const loadClientsMMKV = (): Client[] => {
    const json = storage.getString(CLIENTS_KEY);
    return json ? JSON.parse(json) : [];
};

export const saveClientsMMKV = (clients: Client[]) => {
    storage.set(CLIENTS_KEY, JSON.stringify(clients));
};

export const addClientMMKV = (newClient: Client) => {
    const clients = loadClientsMMKV();
    clients.push(newClient);
    saveClientsMMKV(clients);
};

export const updateClientMMKV = (updatedClient: Client) => {
    let clients = loadClientsMMKV();
    clients = clients.map(c => c.clientId === updatedClient.clientId ? updatedClient : c);
    saveClientsMMKV(clients);
};

export const deleteClientMMKV = (clientId: string) => {
    let clients = loadClientsMMKV();
    clients = clients.filter(c => c.clientId !== clientId);
    saveClientsMMKV(clients);
};
