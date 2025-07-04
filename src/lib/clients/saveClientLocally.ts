import { PartialClient } from "@/src/components/types/Service";
import { useUserDataStore } from "@/src/store/useUserDataStore";
import UUID from 'react-native-uuid';
import { createFullClient } from "./client";
import { saveClientsMMKV } from "@/src/store/mmkv/MMKVStorageClients";

export const saveClientLocally = (params: PartialClient) => {
    const clientId = UUID.v4();

    const fullClient = createFullClient({
        ...params,
        clientId,
    });

    useUserDataStore.getState().addClient(fullClient);
    const clients = useUserDataStore.getState().clients;

    saveClientsMMKV(clients);

    return fullClient;
};