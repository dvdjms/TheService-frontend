import { PartialAppointment } from "@/src/components/types/Service";
import { useUserDataStore } from "@/src/store/useUserDataStore";
import UUID from 'react-native-uuid';
import { createFullAppointment } from "./appts";
import { saveApptsMMKV } from "@/src/store/mmkv/mmkvStorageAppts";


export const saveApptLocally = (params: PartialAppointment) => {
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
        saveApptsMMKV(appts);
        
    return fullAppointment;
};