import { create } from 'zustand';
import { Client } from '../components/types/Service';
import { persist, PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


type ClientStore = {
    selectedClient: Client | null;
    clients: Client[];
    setSelectedClient: (client: Client) => void;
    setClients: (clients: Client[]) => void;
    clearClients: () => void;
    addClient: (client: Client) => void;
    updateClient: (updatedClient: Client) => void;
    removeClient: (id: string) => void;
};


const zustandAsyncStorage: PersistStorage<{ selectedClient: Client | null; clients: Client[] }> = {
    getItem: async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error("Error reading from AsyncStorage", error);
            return null;
        }
    },
    setItem: async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error writing to AsyncStorage", error);
        }
    },
    removeItem: async (key) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error("Error removing from AsyncStorage", error);
        }
    },
};


export const useClientStore = create<ClientStore>()(
    persist(
        (set) => ({
            selectedClient: null,
            clients: [],
            setSelectedClient: (client) => set({ selectedClient: client }),
            setClients: (clients) => set({ clients }),
            clearClients: () => set({ selectedClient: null }),

            addClient: (client) => set(state => ({ clients: [...state.clients, client] })),
            updateClient: (updatedClient) => set(state => ({
                clients: state.clients.map(c => c.clientId === updatedClient.clientId ? updatedClient : c)
            })),
            removeClient: (id) => set(state => ({
                clients: state.clients.filter(c => c.clientId !== id)
            })),
        }),
        {
            name: 'client-store',
            storage: zustandAsyncStorage,
            partialize: (state) => ({
                selectedClient: state.selectedClient,
                clients: state.clients,
            }),
        }
    )
);

