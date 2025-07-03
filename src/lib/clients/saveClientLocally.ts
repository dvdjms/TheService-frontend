import { PartialClient } from "@/src/components/types/Service";
import { saveClientsAsyncStorage } from "@/src/store/asyncStorageHelpers";
import { useUserDataStore } from "@/src/store/useUserDataStore";
import UUID from 'react-native-uuid';
import { createFullClient } from "./client";

export const saveClientLocally = async (params: PartialClient) => {
    const clientId = UUID.v4();

    const fullClient = createFullClient({
        ...params,
        clientId,
    });

    useUserDataStore.getState().addClient(fullClient);
    const clients = useUserDataStore.getState().clients;

    await saveClientsAsyncStorage(clients);

    return fullClient;
};