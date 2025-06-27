// store/slices/clientsSlice.ts
import { StateCreator } from 'zustand';
import { ClientsSlice, useUserDataStore } from '../useUserDataStore';
import { Client } from '@/src/components/types/Service';


export const createClientsSlice: StateCreator<useUserDataStore, [], [], ClientsSlice> = (set, get) => ({
    clients: [],
    setClients: (clients) => set({ clients }),

    selectedClient: null,
    setSelectedClient: (client: any) => set({ selectedClient: client }),
    
    addClient: (client) =>
        set((state) => ({
            clients: [...state.clients, client],
        })),
    updateClient: (updatedClient) =>
        set((state) => ({
            clients: state.clients.map((c) =>
                c.clientId === updatedClient.clientId ? updatedClient : c
            ),
        })),
    removeClient: (id) =>
        set((state) => ({
            clients: state.clients.filter((c) => c.clientId !== id),
        })),
    getClientById: (id) => get().clients.find((c) => c.clientId === id),
    clearClients: () => set({ clients: [] }),
});
