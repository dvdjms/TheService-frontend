import { StateCreator } from 'zustand';
import { AppointmentsSlice, useUserDataStore } from '../useUserDataStore';


export const createAppointmentsSlice: StateCreator<useUserDataStore, [], [], AppointmentsSlice> = (set, get) => ({
    appointments: [],
    setAppointments: (appointments) => set({ appointments }),

    selectedAppointment: null,
    setAppointment: (appointment: any) => set({ selectedAppointment: appointment }),

    addAppointment: (appt) =>
        set((state) => ({
            appointments: [...state.appointments, appt],
        })),
    updateAppointment: (updatedAppt) =>
        set((state) => ({
            appointments: state.appointments.map((a) =>
                a.apptId === updatedAppt.apptId ? updatedAppt : a
            ),
        })),
    removeAppointment: (id) =>
        set((state) => ({
            appointments: state.appointments.filter((a) => a.apptId !== id),
        })),
    getAppointmentById: (id) => get().appointments.find((a) => a.apptId === id),
    clearAppointments: () => set({ appointments: [] }),
});
