import { useMemo } from "react";
import { calculatePositionedAppointments } from "../utils/appoinmentHelpers";


export const usePositionedAppointments = (displayDate: number, allGroupedAppointments: any) => {
    const dateStartMs = useMemo(() => {
        const d = new Date(displayDate);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    }, [displayDate]);

    const currentAppointments = useMemo(() => {
        return allGroupedAppointments[dateStartMs] || [];
    }, [allGroupedAppointments, dateStartMs]);

    const positionedAppointments = useMemo(
        () => calculatePositionedAppointments(currentAppointments, dateStartMs),
        [currentAppointments, dateStartMs]
    );

    return positionedAppointments;
};

