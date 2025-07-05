import { getAppts } from "@/src/store/appts/apptController";
import { getClients } from "@/src/store/clients/clientController";


export const initializeUserData = async (userId: string, accessToken: string, tier: string) => {

    await getClients(userId, accessToken, tier);
    await getAppts(userId, accessToken, tier);
    // const images = tier === 'free' ? [] : await imageController.getAll(userId, accessToken);

    // loadLocalImagesOnly();
};


