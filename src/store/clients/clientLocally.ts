import { Client, PartialClient } from "@/src/components/types/Service";

import UUID from 'react-native-uuid';
import { createFullClient } from "./clientPaylaod";
import { addClientMMKV, loadClientsMMKV, saveClientsMMKV } from "@/src/store/mmkv/mmkvStorageClients";
import { useUserDataStore } from "../zustand/useUserDataStore";
import { loadApptsMMKV } from "../mmkv/mmkvStorageAppts";


export const loadClientsLocally = () => {
    const clients = loadClientsMMKV();
    return clients;
};


export const saveClientLocally = (client: Client) => {
    addClientMMKV(client);
    return {clientId: client.clientId, client };
};



export const deleteClientLocally = (clientId: string) => {
    useUserDataStore.getState().removeClient(clientId);

    const clients = useUserDataStore.getState().clients;
    saveClientsMMKV(clients);
};



export const updateClientLocally = (client: Client): Client => {
    const updatedClient = {
        ...client,
        updatedAt: new Date().toISOString(),
    };

    // Save to MMKV
    const existingClients = loadClientsMMKV();
    const newClients = existingClients.map(c =>
        c.clientId === updatedClient.clientId ? updatedClient : c
    );
    saveClientsMMKV(newClients);

    return updatedClient;
};
