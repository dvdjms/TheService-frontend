import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment, Client } from '../components/types/Service';


const CLIENTS_KEY = 'clients';
const Appt_KEY = 'apointments';

// Clients - asyncStorage functions
export const loadClientsAsyncStorage = async (): Promise<Client[] | null> => {
    try {
        const json = await AsyncStorage.getItem(CLIENTS_KEY);
        return json ? JSON.parse(json) : null;
    } catch (e) {
        console.warn('Failed to load clients from storage', e);
        return null;
    }
};

export const saveClientsAsyncStorage = async (clients: Client[]) => {
    try {
        const json = JSON.stringify(clients);
        await AsyncStorage.setItem(CLIENTS_KEY, json);
    } catch (e) {
        console.warn('Failed to save clients to storage', e);
    }
};

export const addClientAsyncStorage = async (newClient: Client) => {
    const clients = (await loadClientsAsyncStorage()) ?? [];
    clients.push(newClient);
    await saveClientsAsyncStorage(clients);
};

export const updateClient = async (updatedClient: Client) => {
    let clients = (await loadClientsAsyncStorage()) ?? [];
    clients = clients.map(c => c.clientId === updatedClient.clientId ? updatedClient : c);
    await saveClientsAsyncStorage(clients);
};

export const deleteClient = async (clientId: string) => {
    let clients = (await loadClientsAsyncStorage()) ?? [];
    clients = clients.filter(c => c.clientId !== clientId);
    await saveClientsAsyncStorage(clients);
};


// Appointments - asyncStorage functions
export const loadApptsAsyncStorage = async (): Promise<Appointment[] | null> => {
    try {
        const json = await AsyncStorage.getItem(Appt_KEY);
        return json ? JSON.parse(json) : null;
    } catch (e) {
        console.warn('Failed to load appointments from storage', e);
        return null;
    }
};

export const saveApptsAsyncStorage = async (appts: Appointment[]) => {
    try {
        const json = JSON.stringify(appts);
        await AsyncStorage.setItem(Appt_KEY, json);
    } catch (e) {
        console.warn('Failed to save appointments to storage', e);
    }
};

export const addApptAsyncStorage = async (newAppt: Appointment) => {
    const appts = (await loadApptsAsyncStorage()) ?? [];
    appts.push(newAppt);
    await saveApptsAsyncStorage(appts);
};

export const updateApptAsyncStorage = async (updatedAppt: Appointment) => {
    let appts = (await loadApptsAsyncStorage()) ?? [];
    appts = appts.map(c => c.apptId === updatedAppt.apptId ? updatedAppt : c);
    await saveApptsAsyncStorage(appts);
};

export const deleteAppt = async (apptId: string) => {
    let appts = (await loadApptsAsyncStorage()) ?? [];
    appts = appts.filter(c => c.apptId !== apptId);
    await saveApptsAsyncStorage(appts);
};
