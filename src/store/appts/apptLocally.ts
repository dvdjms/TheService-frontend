import { Appointment, PartialAppointment } from "@/src/components/types/Service";
import UUID from 'react-native-uuid';
import { createFullAppointment } from "./apptsPayload";
import { loadApptsMMKV, saveApptsMMKV } from "@/src/store/mmkv/mmkvStorageAppts";


export const loadApptsLocally = () => {
    const appts = loadApptsMMKV(); // Reads from MMKV
    return appts;
};


export const saveApptLocally = (params: PartialAppointment): Appointment[] => {
    const apptId = UUID.v4() as string;
    const now = new Date().toISOString();

        const fullAppointment = createFullAppointment({
            ...params,
            apptId,
            createdAt: now,
            updatedAt: now,
        });

        const existingAppts = loadApptsMMKV() || [];
        const updatedAppts = [...existingAppts, fullAppointment]
        saveApptsMMKV(updatedAppts);
        
    return updatedAppts;
};


export const updateApptLocally = (appt: Appointment) => {
    const updatedAppt = {
        ...appt,
        updatedAt: new Date().toISOString(),
    };

    const existingAppts = loadApptsMMKV();
    const newAppts = existingAppts.map(a => 
        a.apptId === updatedAppt.apptId ? updatedAppt : a
    )
    saveApptsMMKV(newAppts);

    return updatedAppt;
};




export const deleteApptLocally = (apptId: string) => {

    // saveApptsMMKV(apptId);
};