import { SharedValue } from "react-native-reanimated";

export type TimeBlock = {
    startMinutes: number | null;
    endMinutes: number | null;
    date: string
};

// export const getTimeBlockFromY = (
//     y: number,
//     HOUR_HEIGHT: number
// ): TimeBlock => {
//     'worklet'; 
//     const minutesPerPixel = 60 / HOUR_HEIGHT;
//     const startMinutes = Math.floor(y * minutesPerPixel / 15) * 15;
//     return {
//         startMinutes,
//         endMinutes: startMinutes + 60, // Default 1 hour block
//     };
// };

export const getTimeBlockFromY = (y: number, hourHeight: number, date: string) => {
    'worklet';
    const interval = 15;
    const startMinutes = Math.floor((y / hourHeight) * 60 / interval) * interval;
    const endMinutes = startMinutes + interval * 4;
    return { startMinutes, endMinutes, date };
};

// export const getYFromTimeBlock = (
//     block: TimeBlock,
//     HOUR_HEIGHT: number
// ): { top: number; height: number } => {
//     const pixelsPerMinute = HOUR_HEIGHT / 60;
//     const top = block.startMinutes * pixelsPerMinute;
//     const height = (block.endMinutes - block.startMinutes) * pixelsPerMinute;
//     return { top, height };
// };

export const roundMinutesTo15 = (min: number) => {
    'worklet'; 
    Math.round(min / 15) * 15;
}


export const updateTimeBlockDate = (
    selectedTimeBlock: SharedValue<TimeBlock>,
    newDate: string
) => {
    'worklet';
    const block = selectedTimeBlock.value;
    if (block) {
        selectedTimeBlock.value = {
            ...block,
            date: newDate,
        };
    }
};