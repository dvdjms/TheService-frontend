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


// export const useAdjacentDates = (baseDate: string) => {
//     const prevDate = subDays(new Date(baseDate), 1).toISOString().split('T')[0];
//     const nextDate = addDays(new Date(baseDate), 1).toISOString().split('T')[0];
//     return { prevDate, nextDate };
// }

export const useAdjacentDates = (baseDate: string) => {
    return useMemo(() => {
        const prevDate = subDays(new Date(baseDate), 1).toISOString().split('T')[0];
        const nextDate = addDays(new Date(baseDate), 1).toISOString().split('T')[0];
        return { prevDate, nextDate };
    }, [baseDate]);
}