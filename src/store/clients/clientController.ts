import { Client, PartialClient } from "@/src/components/types/Service";
import { saveClientDynamo, updateClientDynamo, deleteClientDynamo, getClientsDynamo } from "./clientDynamo";
import { deleteClientLocally, loadClientsLocally, saveClientLocally, updateClientLocally } from "./clientLocally";
import { useUserDataStore } from "../zustand/useUserDataStore";


export const getClients = async (userId: string, accessToken: string, tier: string): Promise<Client[]> => {
    const clients = tier === 'free' 
        ? loadClientsLocally()
        : await getClientsDynamo(userId, accessToken);
    
    useUserDataStore.getState().setClients(clients);
    return clients;
}


export const saveClient = async (params: PartialClient, accessToken: string, tier: string,) => {
    if (tier === "free") {
        return saveClientLocally(params);
    } else if (accessToken) {
        return await saveClientDynamo(params, accessToken);
    }
};


export const updateClient = async (clientId: string, updatedData: Client, accessToken: string, tier: string
): Promise<Client | null> => {
    const store = useUserDataStore.getState();

    if (tier === "free") {
        const updatedClient = updateClientLocally(updatedData);
        store.replaceClient(clientId, updatedClient);
        return updatedClient;
    }

    if (!accessToken) throw new Error("Access token required");

    const prevClient = store.getClientById(clientId);

    const optimisticClient = {
        ...prevClient,
        ...updatedData,
        updatedAt: new Date().toISOString(),
    };

    store.replaceClient(clientId, optimisticClient); // optimistic update

    try {
        const confirmedClient = await updateClientDynamo(clientId, updatedData, accessToken);

        if (!confirmedClient) throw new Error("Client update failed");

        store.replaceClient(clientId, confirmedClient);
        return confirmedClient;
    } catch (err) {
        console.error("Failed to update client:", err);
        if (prevClient) store.replaceClient(clientId, prevClient); // rollback
        return null;
    }
};


export const deleteClient = async (userId: string, clientId: string, accessToken: string, tier: string) => {

    if (tier === "free") {
        return deleteClientLocally(clientId);
    } else if (accessToken && userId) {
        return await deleteClientDynamo(userId, clientId, accessToken);
    }
};
