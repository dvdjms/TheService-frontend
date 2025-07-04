import { createClient, deleteClient, updateClient } from "@/src/api/clients";
import { Client, PartialClient } from "@/src/components/types/Service";
import { useUserDataStore } from "@/src/store/useUserDataStore";
import UUID from 'react-native-uuid';
import { createFullClient } from "./client";


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


export const updateClientDynamo = async (updatedFields: Client, accessToken: string) => {
    const { clientId } = updatedFields;
    if (!clientId) return null;

    const prevClient = useUserDataStore.getState().getClientById(clientId);
    
    const optimisticClient = {
        ...prevClient,
        ...updatedFields,
        updatedAt: new Date().toISOString(),
    };


    useUserDataStore.getState().replaceClient(clientId, optimisticClient);

    try {
        const response = await updateClient(clientId, accessToken, updatedFields);
        if (!response?.client) {
            throw new Error("Update failed");
        }

        const confirmedClient = response.client.ToolboxItem;
        useUserDataStore.getState().replaceClient(clientId, confirmedClient);
        
        return confirmedClient;
    } catch (err) {
        console.error("Failed to update client:", err);
        // Roll back
        if (prevClient) {
            useUserDataStore.getState().replaceClient(clientId, prevClient);
        }
        return null;
    }
};
