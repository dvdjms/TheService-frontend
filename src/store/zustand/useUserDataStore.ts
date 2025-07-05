import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Client, Appointment, Image, LocalImage } from '@/src/components/types/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserSlice } from './slices/userSlice';
import { createClientsSlice } from './slices/clientSlice';
import { createApptsSlice } from './slices/apptSlice';
import { createImagesSlice } from './slices/imageSlice';
import { createLocalImagesSlice } from './slices/localImageSlice';


// === SLICE TYPES ===
export interface UserSlice {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

export interface ClientsSlice {
    clients: Client[];
    setClients: (clients: Client[]) => void;
    selectedClient: Client | null,
    setSelectedClient: (client: Client) => void;
    addClient: (client: Client) => void;
    updateClient: (client: Client) => void;
    removeClient: (id: string) => void;
    getClientById: (id: string) => Client | undefined;
    replaceClient: (tempId: string, newClient: Client) => void;
}

export interface ApptsSlice {
    appts: Appointment[];
    setAppts: (appts: Appointment[]) => void;
    selectedAppt: Appointment | null,
    setSelectedAppt: (appt: Appointment) => void;
    addAppt: (appt: Appointment) => void;
    updateAppt: (appt: Appointment) => void;
    removeAppt: (id: string) => void;
    getApptById: (id: string) => Appointment | undefined;
    replaceAppt: (tempId: string, newAppt: Appointment) => void;
}

export interface ImagesSlice {
    images: Image[];
    setImages: (images: Image[]) => void;
}

export interface LocalImagesSlice {
    localImages: LocalImage[];
    setLocalImages: (images: LocalImage[]) => void;
    addLocalImage: (image: LocalImage) => void;
    removeLocalImage: (uri: string) => void;
    markAsUploaded: (uri: string) => void;
    clearAllLocalImages: () => void;
}

export type useUserDataStore = UserSlice & ClientsSlice & ApptsSlice & ImagesSlice & LocalImagesSlice;

// === STORE CREATION ===
export const useUserDataStore = create<useUserDataStore>()(
    persist(
        (set, get, store) => ({
            ...createUserSlice(set, get, store),
            ...createClientsSlice(set, get, store),
            ...createApptsSlice(set, get, store),
            ...createImagesSlice(set, get, store),
            ...createLocalImagesSlice(set, get, store),
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

