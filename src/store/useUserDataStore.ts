import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User, Client, Appointment, Image } from '@/src/components/types/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserSlice } from './slices/userSlice';
import { createClientsSlice } from './slices/clientSlice';
import { createAppointmentsSlice } from './slices/apptSlice';
import { createImagesSlice } from './slices/imageSlice';


// === SLICE TYPES ===
export interface UserSlice {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

export interface ClientsSlice {
    clients: Client[];
    setClients: (clients: Client[]) => void;
    selectedClient: null,
    setSelectedClient: (client: Client) => void;
    addClient: (client: Client) => void;
    updateClient: (client: Client) => void;
    removeClient: (id: string) => void;
    getClientById: (id: string) => Client | undefined;
}

export interface AppointmentsSlice {
    appointments: Appointment[];
    selectedAppointment: null,
    setAppointments: (appointments: Appointment[]) => void;
    addAppointment: (appointment: Appointment) => void;
    updateAppointment: (appointment: Appointment) => void;
    removeAppointment: (id: string) => void;
    getAppointmentById: (id: string) => Appointment | undefined;
}

export interface ImagesSlice {
    images: Image[];
    setImages: (images: Image[]) => void;
}

export type useUserDataStore = UserSlice & ClientsSlice & AppointmentsSlice & ImagesSlice;

// === STORE CREATION ===
export const useUserDataStore = create<useUserDataStore>()(
    persist(
        (set, get, store) => ({
            ...createUserSlice(set, get, store),
            ...createClientsSlice(set, get, store),
            ...createAppointmentsSlice(set, get, store),
            ...createImagesSlice(set, get, store),
        }),
        {
            name: 'user-data-store',
            storage: {
                getItem: async (key) => {
                    const item = await AsyncStorage.getItem(key);
                    return item ? JSON.parse(item) : null;
                },
                setItem: async (key, value) => {
                    await AsyncStorage.setItem(key, JSON.stringify(value));
                },
                removeItem: async (key) => {
                    await AsyncStorage.removeItem(key);
                },
            },
        }
    )
);



