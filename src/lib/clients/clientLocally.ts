import { Client, PartialClient } from "@/src/components/types/Service";
import { useUserDataStore } from "@/src/store/useUserDataStore";
import UUID from 'react-native-uuid';
import { createFullClient } from "./client";
import { saveClientsMMKV } from "@/src/store/mmkv/mmkvStorageClients";


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


export const updateClientLocally = (updatedClient: Client) => {
    useUserDataStore.getState().updateClient(updatedClient);

    const clients = useUserDataStore.getState().clients;
    saveClientsMMKV(clients);
};