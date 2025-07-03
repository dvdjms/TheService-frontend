import { PartialAppointment } from "@/src/components/types/Service";
import { saveApptsAsyncStorage } from "@/src/store/asyncStorageHelpers";
import { useUserDataStore } from "@/src/store/useUserDataStore";
import UUID from 'react-native-uuid';
import { createFullAppointment } from "./appts";


export const saveApptLocally = async (params: PartialAppointment) => {
    const apptId = UUID.v4();
    const now = new Date().toISOString();

        const fullAppointment = createFullAppointment({
            ...params,
            apptId,
            createdAt: now,
            updatedAt: now,
        });

        useUserDataStore.getState().addAppt(fullAppointment);

        const appts = useUserDataStore.getState().appts;
        await saveApptsAsyncStorage(appts);
        
    return fullAppointment;
};