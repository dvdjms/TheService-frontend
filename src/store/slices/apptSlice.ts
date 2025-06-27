import { StateCreator } from 'zustand';
import { ApptsSlice, useUserDataStore } from '../useUserDataStore';


export const createApptsSlice: StateCreator<useUserDataStore, [], [], ApptsSlice> = (set, get) => ({
    appts: [],
    setAppts: (appts) => set({ appts }),

    selectedAppt: null,
    setSelectedAppt: (appt: any) => set({ selectedAppt: appt }),

    addAppt: (appt) =>
        set((state) => ({
            appts: [...state.appts, appt],
        })),
    updateAppt: (updatedAppt) =>
        set((state) => ({
            appts: state.appts.map((a) =>
                a.apptId === updatedAppt.apptId ? updatedAppt : a
            ),
        })),
    removeAppt: (id) =>
        set((state) => ({
            appts: state.appts.filter((a) => a.apptId !== id),
        })),
    getApptById: (id) => get().appts.find((a) => a.apptId === id),
    clearAppts: () => set({ appts: [] }),
});
