import { StateCreator } from 'zustand';
import { ClientsSlice, useUserDataStore } from '../useUserDataStore';
import { Client } from '@/src/components/types/Service';


export const createClientsSlice: StateCreator<useUserDataStore, [], [], ClientsSlice> = (set, get) => ({
    clients: [],
    setClients: (clients: Client[]) => set({ clients }),

    selectedClient: null,
    setSelectedClient: (client: Client) => set({ selectedClient: client }),
    
    addClient: (client: Client) =>
        set((state) => ({
            clients: [...state.clients, client],
        })),
    updateClient: (updatedClient: Client) =>
        set((state) => ({
            clients: state.clients.map((c) =>
                c.clientId === updatedClient.clientId ? updatedClient : c
            ),
        })),
    removeClient: (id: string) =>
        set((state) => ({
            clients: state.clients.filter((c) => c.clientId !== id),
        })),
    getClientById: (id: string) => get().clients.find((c) => c.clientId === id),
    clearClients: () => set({ clients: [] }),

    replaceClient: (tempId: string, newClient: Client) => {
        set(state => ({
            clients: state.clients.map(client =>
            client.clientId === tempId ? newClient : client
        )})
    )}

});
