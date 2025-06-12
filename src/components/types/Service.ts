import { Dispatch, SetStateAction } from "react";
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
    date: number;
};


export type CalendarDayViewHandle = {
    swipeToDateImpl: (date: Date) => void;
};

export interface UseSwipeGesturesProps {
    screenWidth: number;
    isSwiping: SharedValue<boolean>;
    selectedDateShared: SharedValue<number>;
    previewDate: SharedValue<number | null>;
    verticalThreshold: number;
    velocityThreshold: number;
    translateY: SharedValue<number>;
    translateX: SharedValue<number>;
    swipeThreshold: number;
    isMonthVisible: boolean;
    collapseMonth: () => void;
    setSelectedDate: Dispatch<SetStateAction<number>>
    // updateReactSelectionDate: (targetTimestamp: number) => void;
    // centerViewIndex: SharedValue<number>

    isContentReadyForSnap: SharedValue<boolean>;

    // cycleOffset: SharedValue<number>;
}

export interface UseTimeBlockGesturesProps {
    // Layout constants
    HOUR_HEIGHT: number;
    PIXELS_PER_MINUTE: number;
    MINUTES_PER_STEP: number;
    MIN_DURATION: number;
    MINUTES_IN_DAY: number;
    // UI positioning and scroll state
    masterScrollOffsetY: SharedValue<number>
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
    selectedDateShared: SharedValue<number>;
    dateTimestamp: number;
    displayDate: number;
    // Output
    setIsBlockRenderable: React.Dispatch<React.SetStateAction<boolean>>;
}


export interface Appointment {
    PK: string;
    SK: string;
    appointmentId: string;
    clientId: string;
    appointment_title: string;
    startTimestamp: number;
    endTimestamp: number;
    start_minutes: number;
    end_minutes: number;
    startTimeStr: string;
    dateStr: string;
    color: string;
}

export interface PositionedAppointment extends Appointment {
    topOffset: number;
    blockHeight: number;
}
