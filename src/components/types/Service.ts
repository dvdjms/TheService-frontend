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
    isTimeBlockTouched: SharedValue<boolean>

    // UI states
    isMonthVisible: boolean;
    isModalVisible:  SharedValue<boolean>;
    selectedDateShared: SharedValue<number>;
    dateTimestamp: number;
    displayDate: number;
    isModalExpanded:  SharedValue<boolean>;
    // Output
    setIsBlockRenderable: React.Dispatch<React.SetStateAction<boolean>>;
}


export type UserDataStore = {
    user: User | null;
    clients: Client[];
    appointments: Appointment[];
    images: Image[];
    userData: UserData;
};


export interface UserData {
    user: User;
    clients: Client[];
    appointments: Appointment[];
    images: Image[];
}


export interface User {
    PK: string,
    SK: string
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    subscriptionTier: string,
    type: string,
    createdAt: string,
    updatedAt: string,
}

export interface Image {
    PK: string,
    SK: string,
    userId: string,
    clientId: string;
    apptId: string;
    imageId: string,
    S3Addess: string,
    createdAt: string,
}

export interface Appointment {
    PK: string;
    SK: string;
    userId: string,
    clientId: string;
    apptId: string;
    title: string;
    notes: string;
    startTime: number;
    endTime: number;
    startHour: number;
    endHour: number;
    colour: string;
}

export interface Client {
    PK: string;
    SK: string;
    userId: string
    clientId: string;
    firstName: string,
    lastName: string,
    fullName: string,
    email: string,
    phone: string,
    notes: string,
    address1: string,
    address2: string,
    city: string,
    stateOrProvince: string,
    postalCode: string,
    countryCode: string,
    lat: number,
    lng: number,
    type: string,
    createdAt: string,
    updatedAt: string,
}


export interface PositionedAppointment extends Appointment {
    topOffset: number;
    blockHeight: number;
}

