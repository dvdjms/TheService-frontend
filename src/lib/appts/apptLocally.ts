import { PartialAppointment } from "@/src/components/types/Service";
import { useUserDataStore } from "@/src/store/useUserDataStore";
import UUID from 'react-native-uuid';
import { createFullAppointment } from "./appts";
import { saveApptsMMKV } from "@/src/store/mmkv/mmkvStorageAppts";


export const saveApptLocally = (params: PartialAppointment) => {
    const apptId = UUID.v4() as string;
    const now = new Date().toISOString();

        const fullAppointment = createFullAppointment({
            ...params,
            apptId,
            createdAt: now,
            updatedAt: now,
        });

        const store = useUserDataStore.getState();
        store.addAppt(fullAppointment);

        const updatedAppts = store.appts;
        saveApptsMMKV(updatedAppts);
        
    return fullAppointment;
};


export const updateApptLocally = (updated: PartialAppointment & { apptId: string }) => {
    const store = useUserDataStore.getState();

    const current = store.appts.find(a => a.apptId === updated.apptId);
    if (!current) return;

    const updatedAppt = {
        ...current,
        ...updated,
        updatedAt: new Date().toISOString(),
    };

    store.replaceAppt(updated.apptId, updatedAppt);
    saveApptsMMKV(store.appts);
};


export const deleteApptLocally = (apptId: string) => {
    const store = useUserDataStore.getState();
    store.removeAppt(apptId);
    saveApptsMMKV(store.appts);
};