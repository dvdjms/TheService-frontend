import { createAppointment, getAllAppointments, updateAppointment } from "@/src/api/appts";
import { createFullAppointment } from "./apptsPayload";
import { Appointment, PartialAppointment } from "@/src/components/types/Service";
import UUID from 'react-native-uuid';
import { useUserDataStore } from "../zustand/useUserDataStore";


export const getApptsDynamo = async (userId: string, accessToken: string): Promise<Appointment[]> => {
    const response = await getAllAppointments(userId, accessToken);
    return response
};


export const saveApptToDynamo = async (params: PartialAppointment, accessToken: string) => {
    const now = new Date().toISOString();
    const tempApptId = UUID.v4();

    const optimisticAppt = createFullAppointment({
        ...params,
        apptId: tempApptId,
        createdAt: now,
        updatedAt: now,
    });

    useUserDataStore.getState().addAppt(optimisticAppt);

    try {
        const response = await createAppointment(accessToken, params);
        const apptId = response.appointment?.ToolboxItem?.apptId;

        if (!response || !apptId) {
            throw new Error("Failed to get appointment ID from server");
        }

        const confirmedAppt = createFullAppointment({
            ...optimisticAppt,
            apptId,
        });

        useUserDataStore.getState().replaceAppt(tempApptId, confirmedAppt);

        return confirmedAppt;
    } catch (error) {
        console.error("Failed to save appointment to Dynamo", error);
        // Rollback optimistic update
        useUserDataStore.getState().removeAppt(tempApptId);
        return null;
    }
};


export const updateApptDynamo = async (appt: Appointment, accessToken: string
): Promise<Appointment | null> => {

    const response = await updateAppointment(appt.userId, appt.clientId, appt. apptId, accessToken, appt);
    return response?.client?.ToolboxItem ?? null;
};

