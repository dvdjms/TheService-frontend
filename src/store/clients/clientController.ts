import { Client, PartialClient } from "@/src/components/types/Service";
import { saveClientDynamo, updateClientDynamo, deleteClientDynamo, getClientsDynamo } from "./clientDynamo";
import { deleteClientLocally, loadClientsLocally, saveClientLocally, updateClientLocally } from "./clientLocally";
import { useUserDataStore } from "../zustand/useUserDataStore";
import UUID from 'react-native-uuid';
import { createFullClient } from "./clientPaylaod";

export const getClients = async (userId: string, accessToken: string, tier: string): Promise<Client[]> => {
    const clients = tier === 'free' 
        ? loadClientsLocally()
        : await getClientsDynamo(userId, accessToken);
    
    useUserDataStore.getState().setClients(clients);
    return clients;
}


export const saveClient = async (client: PartialClient, accessToken: string, tier: string
): Promise<Client | null> => {
    const now = new Date().toISOString();
    const tempClientId = UUID.v4() as string;

    const optimisticClient = createFullClient({
        ...client,
        clientId: tempClientId,
        createdAt: now,
        updatedAt: now,
    });

    useUserDataStore.getState().addClient(optimisticClient);

    try {
        const confirmedClient = tier === 'free'
            ? saveClientLocally(optimisticClient)
            : await saveClientDynamo(optimisticClient, accessToken)
            
         useUserDataStore.getState().replaceClient(tempClientId, confirmedClient.client);

        return confirmedClient.client;
    } catch (error){
        console.error("Failed to save client", error);
        useUserDataStore.getState().removeClient(tempClientId);
        return null;
    }
};


// todo
export const updateClient = async () => {


}


export const deleteClient = async (userId: string, clientId: string, accessToken: string, tier: string) => {
    if (tier === "free") {
        return deleteClientLocally(clientId);
    } else if (accessToken && userId) {
        return await deleteClientDynamo(userId, clientId, accessToken);
    }
};
