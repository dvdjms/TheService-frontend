import { Appointment, PositionedAppointment } from "../types/Service";


const HOUR_HEIGHT = 60;

export const calculatePositionedAppointments = (
    appointments: Appointment[],
    dateStartMs: number
    ): PositionedAppointment[] => {
    return appointments.map(app => {
        const start = app.start_minutes;
        const end = app.end_minutes;
        const topOffset = Math.max(0, ((start - dateStartMs) / 60000 / 60) * HOUR_HEIGHT);
        const blockHeight = ((end - start) / 60000 / 60) * HOUR_HEIGHT;

        return {
            ...app,
            topOffset,
            blockHeight,
        };
    });
};