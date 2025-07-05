import { StateCreator } from 'zustand';
import { ApptsSlice, useUserDataStore } from '../useUserDataStore';
import { Appointment } from '@/src/components/types/Service';


export const createApptsSlice: StateCreator<useUserDataStore, [], [], ApptsSlice> = (set, get) => ({
    appts: [],
    setAppts: (appts: Appointment[]) => set({ appts }),

    selectedAppt: null,
    setSelectedAppt: (appt: Appointment) => set({ selectedAppt: appt }),

    addAppt: (appt: Appointment) =>
        set((state) => ({
            appts: [...state.appts, appt],
        })),
    updateAppt: (updatedAppt: Appointment) =>
        set((state) => ({
            appts: state.appts.map((a) =>
                a.apptId === updatedAppt.apptId ? updatedAppt : a
            ),
        })),
    removeAppt: (id: string) =>
        set((state) => ({
            appts: state.appts.filter((a) => a.apptId !== id),
        })),

    getApptById: (id: string) => get().appts.find((a) => a.apptId === id),
    clearAppts: () => set({ appts: [] }),

    replaceAppt: (tempId: string, newAppt: Appointment) => {
        set(state => ({
            appts: state.appts.map(appt =>
            appt.apptId === tempId ? newAppt : appt
        )})
    )}
});
