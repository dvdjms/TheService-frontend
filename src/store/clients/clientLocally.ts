import { Client, PartialClient } from "@/src/components/types/Service";

import UUID from 'react-native-uuid';
import { createFullClient } from "./clientPaylaod";
import { loadClientsMMKV, saveClientsMMKV } from "@/src/store/mmkv/mmkvStorageClients";
import { useUserDataStore } from "../zustand/useUserDataStore";


export const loadClientsLocally = () => {
    const clients = loadClientsMMKV();
    return clients;
};



export const saveClientLocally = (params: PartialClient) => {
    const clientId = UUID.v4() as string;

    const fullClient = createFullClient({
        ...params,
        clientId,
    });

    useUserDataStore.getState().addClient(fullClient);
    const clients = useUserDataStore.getState().clients;

    saveClientsMMKV(clients);

    return fullClient;
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
