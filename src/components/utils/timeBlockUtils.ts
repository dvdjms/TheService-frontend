import { SharedValue } from "react-native-reanimated";
import { TimeBlock } from "../types/Service";



export const getTimeBlockFromY = (y: number, hourHeight: number, date: Date) => {
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
    newDate: Date
) => {
    'worklet';
    const block = selectedTimeBlock.value;
    if (block) {
        const isoDate = newDate
        selectedTimeBlock.value = {
            ...block,
            date: isoDate,
        };
    }
};



const timeBlockToSerialized = (block: TimeBlock) => ({
  ...block,
  date: block.date.toISOString(),
});

const serializedToTimeBlock = (data: any): TimeBlock => ({
  ...data,
  date: new Date(data.date),
});

// const MINUTES_PER_STEP = 15;
// const MINUTES_IN_HOUR = 60;
// const HOUR_HEIGHT = 60
// const PIXELS_PER_MINUTE = HOUR_HEIGHT / MINUTES_IN_HOUR;

//  export const snapToStep = (pixels: number) => {
//         'worklet';
//         const minutes = pixels / PIXELS_PER_MINUTE;
//         const snappedMinutes = Math.round(minutes / MINUTES_PER_STEP) * MINUTES_PER_STEP;
//         return snappedMinutes * PIXELS_PER_MINUTE;
//     };


export const snapToStep = (pixels: number, PIXELS_PER_MINUTE: number, MINUTES_PER_STEP: number) => {
  'worklet';
  const minutes = pixels / PIXELS_PER_MINUTE;
  const snappedMinutes = Math.round(minutes / MINUTES_PER_STEP) * MINUTES_PER_STEP;
  return snappedMinutes * PIXELS_PER_MINUTE;
};