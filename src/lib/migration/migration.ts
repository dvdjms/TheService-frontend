import { createAppointment, getAllAppointments } from "@/src/api/appts";
import { createClient, getAllClients } from "@/src/api/clients";
import { clearApptsMMKV, saveApptsMMKV } from "@/src/store/mmkv/mmkvStorageAppts";
import { clearClientsMMKV, saveClientsMMKV } from "@/src/store/mmkv/mmkvStorageClients";
import { useUserDataStore } from "@/src/store/useUserDataStore";


// this is a sample function to migrate free tier user to dynamo
export const migrateFreeUserDataToDynamo = async (accessToken: string) => {
    const { clients, appts } = useUserDataStore.getState();

    for (const client of clients) {
        await createClient(accessToken, client); // or saveClientDynamo
    }

    for (const appt of appts) {
        await createAppointment(accessToken, appt);
    }

    clearClientsMMKV();
    clearApptsMMKV();
};



// user downgrades to free tier
export const migrateDynamoToMMKV = async (userId: string, accessToken: string) => {
    const dynamoClients = await getAllClients(userId, accessToken);
    const dynamoAppts = await getAllAppointments(userId, accessToken);

    useUserDataStore.getState().setClients(dynamoClients);
    useUserDataStore.getState().setAppts(dynamoAppts);

    saveClientsMMKV(dynamoClients);
    saveApptsMMKV(dynamoAppts);
};



