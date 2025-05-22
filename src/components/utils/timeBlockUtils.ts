export type TimeBlock = {
    startMinutes: number; // e.g. 60 = 1:00 AM
    endMinutes: number;
};

export const getTimeBlockFromY = (
    y: number,
    HOUR_HEIGHT: number
): TimeBlock => {
    'worklet'; 
    const minutesPerPixel = 60 / HOUR_HEIGHT;
    const startMinutes = Math.floor(y * minutesPerPixel / 15) * 15;
    return {
        startMinutes,
        endMinutes: startMinutes + 60, // Default 1 hour block
    };
};

export const getYFromTimeBlock = (
    block: TimeBlock,
    HOUR_HEIGHT: number
): { top: number; height: number } => {
    const pixelsPerMinute = HOUR_HEIGHT / 60;
    const top = block.startMinutes * pixelsPerMinute;
    const height = (block.endMinutes - block.startMinutes) * pixelsPerMinute;
    return { top, height };
};

export const roundMinutesTo15 = (min: number) => {
    'worklet'; 
    Math.round(min / 15) * 15;
}
