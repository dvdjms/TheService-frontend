import { Appointment } from "@/src/components/types/Service";
import { addApptMMKV, loadApptsMMKV, saveApptsMMKV } from "@/src/store/mmkv/mmkvStorageAppts";


export const loadApptsLocally = () => {
    const appts = loadApptsMMKV();
    return appts;
};


export const saveApptLocally = (appt: Appointment) => {
    addApptMMKV(appt);
    return { apptId: appt.apptId, appt };
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