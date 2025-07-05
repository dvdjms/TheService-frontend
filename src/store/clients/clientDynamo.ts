import { createClient, deleteClient, getAllClients, updateClient } from "@/src/api/clients";
import { Client, PartialClient } from "@/src/components/types/Service";
import { createFullClient } from "./clientPaylaod";
import { useUserDataStore } from "../zustand/useUserDataStore";
import UUID from 'react-native-uuid';




export const getClientsDynamo = async (userId: string, accessToken: string): Promise<Client[]> => {
    const response = await getAllClients(userId, accessToken);
    return response
};


export const saveClientDynamo = async (params: PartialClient, accessToken: string) => {
    const now = new Date().toISOString();
    const tempClientId = UUID.v4();

    const optimisticClient = createFullClient({
        ...params,
        clientId: tempClientId,
        createdAt: now,
        updatedAt: now,
    });

    useUserDataStore.getState().addClient(optimisticClient);

    try {
        const response = await createClient(accessToken, params);
        const clientId = response.client?.ToolboxItem?.clientId;

        if (!response || !clientId) {
            throw new Error("Failed to get client ID from server");
        }

        const confirmedClient = createFullClient({
            ...optimisticClient,
            clientId,
        });

        useUserDataStore.getState().replaceClient(tempClientId, confirmedClient);

        return confirmedClient;
    } catch (error) {
        console.error("Failed to save client to Dynamo", error);
        // Rollback optimistic update
        useUserDataStore.getState().removeClient(tempClientId);
        return null;
    }
};


export const deleteClientDynamo = async (userId: string, clientId: string, accessToken: string) => {
    // Optimistically remove client
    const previousClient = useUserDataStore.getState().getClientById(clientId); // optional
    useUserDataStore.getState().removeClient(clientId);

    try {
        const response = await deleteClient(userId, clientId, accessToken);

        if (!response?.client) {
        throw new Error("Delete failed on server");
        }

        return response;
    } catch (error) {
        console.error("Failed to delete client from Dynamo:", error);

        // Rollback optimistic update if needed
        if (previousClient) {
            useUserDataStore.getState().addClient(previousClient);
        }

        return null;
    }
};



export const updateClientDynamo = async (clientId: string, updatedFields: Partial<Client>, accessToken: string
): Promise<Client | null> => {
    const response = await updateClient(clientId, accessToken, updatedFields);
    return response?.client?.ToolboxItem ?? null;
};