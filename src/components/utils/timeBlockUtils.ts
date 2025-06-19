import { SharedValue } from "react-native-reanimated";
import { TimeBlock } from "../types/Service";



export const getTimeBlockFromY = (y: number, hourHeight: number, date: number) => {
    'worklet';
    const interval = 15;
    const minutes = (y / hourHeight) * 60
    const startMinutes = Math.floor(minutes / interval) * interval;
    const endMinutes = startMinutes + interval * 4;
    return { startMinutes, endMinutes, date };
};


export const convertMinutesToTimeStamp = (dateTimestamp: number, minutesSinceMidnight: number) => {
  if (!dateTimestamp || minutesSinceMidnight == null) return null;

  // 1. Create a new Date object from the timestamp (resets to midnight)
  const date = new Date(dateTimestamp);

  // 2. Set hours, minutes, seconds, ms based on minutesSinceMidnight
  const hours = Math.floor(minutesSinceMidnight / 60);
  const minutes = minutesSinceMidnight % 60;

  date.setHours(hours, minutes, 0, 0);

  // 3. Return the timestamp in milliseconds
  return date.getTime();
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
    newDate: number
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
  date: block.date,
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