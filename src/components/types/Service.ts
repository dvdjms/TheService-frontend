import { SharedValue } from "react-native-reanimated";

export type DurationType = 'hour' | 'day' | 'week' | 'month';

export interface Service {
    name: string;
    durationType: DurationType;
    durationValue: number;
}

export type TimeBlock = {
    startMinutes: number | null;
    endMinutes: number | null;
    date: Date;
};

export type Appointment = {
    id: string;
    appointment_title: string;
    date: string;
    startMinutes: string;
    endMinutes: string;
};

export type CalendarDayViewHandle = {
    swipeToDateImpl: (date: Date) => void;
};

export interface UseSwipeGesturesProps {
    screenWidth: number;
    isSwiping: SharedValue<boolean>;
    prevDate: number;
    nextDate: number;
    previewDate: SharedValue<number>;
    currentTimestamp: SharedValue<number>;
    verticalThreshold: number;
    velocityThreshold: number;
    translateY: SharedValue<number>;
    translateX: SharedValue<number>;
    swipeThreshold: number;
    isMonthVisible: boolean;
    goToNextDay: () => void
    goToPreviousDay: () => void
    collapseMonth: () => void;
}

export interface UseTimeBlockGesturesProps {
    // Layout constants
    HOUR_HEIGHT: number;
    PIXELS_PER_MINUTE: number;
    MINUTES_PER_STEP: number;
    MIN_DURATION: number;
    MINUTES_IN_DAY: number;
    // UI positioning and scroll state
    dayColumnY: number;
    scrollOffset: SharedValue<number>

    // Time block interaction state
    selectedTimeBlock: SharedValue<TimeBlock>;
    topInitialStart: SharedValue<number>;
    bottomInitialEnd: SharedValue<number>;
    initialStart: SharedValue<number>;
    initialEnd: SharedValue<number>;
    height: SharedValue<number>;
    startHeight: SharedValue<number>;

    // UI states
    isMonthVisible: boolean;
    isModalVisible:  SharedValue<boolean>;
    currentDate: Date;

    // Output
    setIsBlockRenderable: React.Dispatch<React.SetStateAction<boolean>>;
}
