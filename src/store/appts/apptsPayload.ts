import { Appointment } from "../../components/types/Service";

export const createFullAppointment = (data: {
    userId: string;
    clientId: string;
    apptId: string
    title: string;
    notes?: string;
    startTime: number;
    endTime: number;
    endMinutes: number;
    startMinutes: number;
    colour: string;
    createdAt: string;
    updatedAt: string;
    }): Appointment => {
        
    return {
        PK: `USER#${data.userId}`,
        SK: `APPT#${data.apptId}#CLIENT#${data.clientId}`,
        userId: data.userId,
        clientId: data.clientId,
        apptId: data.apptId,
        title: data.title,
        notes: data.notes || '',
        startTime: data.startTime,
        endTime: data.endTime,
        startMinutes: data.startMinutes,
        endMinutes: data.endMinutes,
        colour: data.colour,   
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };
};
