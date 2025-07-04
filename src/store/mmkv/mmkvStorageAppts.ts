import { Appointment } from '@/src/components/types/Service';
import { storage } from './mmkv';


const APPTS_KEY = 'appointments';

export const loadApptsMMKV = (): Appointment[] => {
    const json = storage.getString(APPTS_KEY);
    return json ? JSON.parse(json) : [];
};

export const saveApptsMMKV = (appts: Appointment[]) => {
    storage.set(APPTS_KEY, JSON.stringify(appts));
};

export const addApptMMKV = (newAppt: Appointment) => {
    const appts = loadApptsMMKV();
    appts.push(newAppt);
    saveApptsMMKV(appts);
};

export const updateApptMMKV = (updatedAppt: Appointment) => {
    let appts = loadApptsMMKV();
    appts = appts.map(c => c.apptId === updatedAppt.apptId ? updatedAppt : c);
    saveApptsMMKV(appts);
};

export const deleteApptMMKV = (apptId: string) => {
    let appts = loadApptsMMKV();
    appts = appts.filter(c => c.apptId !== apptId);
    saveApptsMMKV(appts);
};


export const clearApptsMMKV = () => {
    storage.delete(APPTS_KEY);
};
