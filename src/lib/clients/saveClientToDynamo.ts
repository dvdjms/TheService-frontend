import { createClient } from "@/src/api/clients";
import { PartialClient } from "@/src/components/types/Service";
import { useUserDataStore } from "@/src/store/useUserDataStore";
import UUID from 'react-native-uuid';
import { createFullClient } from "./client";

export const saveClientToDynamo = async (params: PartialClient, accessToken: string) => {
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
