import { createAppointment, getAllAppointments, updateAppointment } from "@/src/api/appts";
import { Appointment } from "@/src/components/types/Service";



export const getApptsDynamo = async (userId: string, accessToken: string): Promise<Appointment[]> => {
    const response = await getAllAppointments(userId, accessToken);
    const apptsArray = response.appointments ?? [];
    return apptsArray;

};


export const saveApptToDynamo = async (appt: Appointment, accessToken: string): Promise<{appt: Appointment, apptId: string}> => {
    const response = await createAppointment(accessToken, appt);
    const apptId = response.appointment?.ToolboxItem?.apptId;

    if (!apptId) {
        throw new Error("Failed to get appointment ID from server");
    }
    const confirmedAppt = { ...appt, apptId}
    return { apptId, appt: confirmedAppt  }
};



export const updateApptDynamo = async (appt: Appointment, accessToken: string
): Promise<Appointment | null> => {

    const response = await updateAppointment(appt.userId, appt.clientId, appt. apptId, accessToken, appt);
    return response?.appt?.ToolboxItem ?? null;
};



