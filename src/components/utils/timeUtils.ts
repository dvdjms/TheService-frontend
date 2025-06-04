import { addDays, subDays } from "date-fns";
import { useMemo } from "react";

export const HOUR_HEIGHT = 60;

const MINUTES_IN_HOUR = 60;
const ROUND_TO_MINUTES = 15;


export const getToday = () => {
    return new Date().toISOString().split('T')[0];
}

export const timeToY = (date: Date): number => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return hours * HOUR_HEIGHT + (minutes / MINUTES_IN_HOUR) * HOUR_HEIGHT;
}

export const yToTime = (y: number): { hours: number; minutes: number } => {
    const totalMinutes = (y / HOUR_HEIGHT) * MINUTES_IN_HOUR;
    const roundedMinutes = Math.round(totalMinutes / ROUND_TO_MINUTES) * ROUND_TO_MINUTES;

    const hours = Math.floor(roundedMinutes / MINUTES_IN_HOUR);
    const minutes = roundedMinutes % MINUTES_IN_HOUR;

    return { hours, minutes };
}

export const yToDate = (y: number, baseDate: Date): Date => {
    const { hours, minutes } = yToTime(y);
    const newDate = new Date(baseDate);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
}

export const yToTime11 = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

export const formatTime = ({ hours, minutes }: { hours: number; minutes: number }): string =>{
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}`;
}


export const getISODateStringOffset = (baseDateStr: string, offset: number): string => {
    'worklet';
    const base = new Date(baseDateStr);
    base.setDate(base.getDate() + offset);
    return base.toISOString().split('T')[0]; // 'YYYY-MM-DD'
};


export const useAdjacentDates = (baseDate: Date) => {
    return useMemo(() => {
        const prevDate = subDays(baseDate, 1);
        const nextDate = addDays(baseDate, 1);
        return { prevDate, nextDate };
    }, [baseDate.getDate()]);
}

const MS_IN_DAY = 24 * 60 * 60 * 1000;
export const addDaysNumber = (timestamp: number, days: number) => {
    'worklet';
    return timestamp + days * MS_IN_DAY;
}


export const useAdjacentDatesDates = (baseDate: Date) => {
    return useMemo(() => {
        const prevDate = subDays(new Date(baseDate), 1).getTime();
        const nextDate = addDays(new Date(baseDate), 1).getTime();
        return { prevDate, nextDate };
    }, [baseDate]);
}

export const useAdjacentDatesNumber = (baseDate: number) => {
    return useMemo(() => {
        const prevDate = subDays(new Date(baseDate), 1).getTime();
        const nextDate = addDays(new Date(baseDate), 1).getTime();
        return { prevDate, nextDate };
    }, [baseDate]);
};


// not really needed
export const encodeAppointmentTime = (date: number) => {
    const dateString = new Date(date)
    const startTimestamp = dateString.getTime();
    const startTimeStr = dateString.toISOString().substring(11, 16); // "09:00"
    const startMinutes = dateString.getHours() * 60 + dateString.getMinutes(); // 540
    
    return { startTimestamp, startTimeStr, startMinutes };
}