import { createClient, deleteClient, getAllClients, updateClient } from "@/src/api/clients";
import { Client } from "@/src/components/types/Service";
import { useUserDataStore } from "../zustand/useUserDataStore";


export const getClientsDynamo = async (userId: string, accessToken: string): Promise<Client[]> => {
    const response = await getAllClients(userId, accessToken);
    const clientsArray = response.clients ?? [];
    return clientsArray;
};


export const saveClientDynamo = async (client: Client, accessToken: string): Promise<{client: Client, clientId: string}> => {
    const response = await createClient(accessToken, client);
    const clientId = response.client?.ToolboxItem?.clientId;

    if (!clientId) {
        throw new Error("Failed to get client ID from server");
    }
    const confirmedClient = { ...client, clientId}
    return { clientId, client: confirmedClient };
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