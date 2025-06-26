import { create } from 'zustand';
import { Appointment } from '../components/types/Service';
import { persist, PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


type ApptStore = {
    selectedAppt: Appointment | null;
    appts: Appointment[];
    setSelectedAppt: (appt: Appointment) => void;
    setAppts: (appts: Appointment[]) => void;
    clearAppts: () => void;
    addAppt: (client: Appointment) => void;
    updateAppt: (updatedClient: Appointment) => void;
    removeAppt: (id: string) => void;
};


const zustandAsyncStorage: PersistStorage<{ selectedAppt: Appointment | null; appts: Appointment[] }> = {
    getItem: async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error('Error reading from AsyncStorage', e);
            return null;
        }
    },
    setItem: async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error writing to AsyncStorage', e);
        }
    },
    removeItem: async (key) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from AsyncStorage', e);
        }
    },
};

export const useApptStore = create<ApptStore>()(
    persist(
        (set) => ({
            selectedAppt: null,
            appts: [],
            setSelectedAppt: (appt) => set({ selectedAppt: appt }),
            setAppts: (appts) => set({ appts }),
            clearAppts: () => set({ selectedAppt: null }),

            // Add a new appointment (append to current list)
            addAppt: (appt: any) => set(state => ({
                appts: [...state.appts, appt]
            })),

            // Update an existing appointment by matching apptId
            updateAppt: (updated: any) => set(state => ({
                appts: state.appts.map(a => a.apptId === updated.apptId ? updated : a)
            })),

            // Remove an appointment by id
            removeAppt: (id: any) => set(state => ({
                appts: state.appts.filter(a => a.apptId !== id)
            })),
        }),
        {
            name: 'appt-store',
            storage: zustandAsyncStorage,
            partialize: (state) => ({
                selectedAppt: state.selectedAppt,
                appts: state.appts,
            }),
        }
    )
);


