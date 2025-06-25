import { create } from 'zustand';
import { Client } from '../components/types/Service';
import { persist, PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


type ClientStore = {
    selectedClient: Client | null;
    clients: Client[];
    setSelectedClient: (client: Client) => void;
    setClients: (clients: Client[]) => void;
    clearClient: () => void;
};


const zustandAsyncStorage: PersistStorage<{ selectedClient: Client | null; clients: Client[] }> = {
    getItem: async (key) => {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    },
    setItem: async (key, value) => {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: async (key) => {
        await AsyncStorage.removeItem(key);
    },
};

export const useClientStore = create<ClientStore>()(
    persist(
        (set) => ({
            selectedClient: null,
            clients: [],
            setSelectedClient: (client) => set({ selectedClient: client }),
            setClients: (clients) => set({ clients }),
            clearClient: () => set({ selectedClient: null }),
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



// export const useClientStore = create<ClientStore>((set) => ({
//     selectedClient: null,
//     setSelectedClient: (client) => set({ selectedClient: client }),
//     clearClient: () => set({ selectedClient: null }),
// }));
