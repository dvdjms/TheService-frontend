import { Appointment, PartialAppointment } from "@/src/components/types/Service";
import { deleteApptLocally, loadApptsLocally, saveApptLocally, updateApptLocally } from "./apptLocally";
import { getApptsDynamo, saveApptToDynamo, updateApptDynamo } from "./apptDynamo";
import { deleteAppointment } from "@/src/api/appts";
import { useUserDataStore } from "../zustand/useUserDataStore";
import UUID from 'react-native-uuid';
import { createFullAppointment } from "./apptsPayload";


export const getAppts = async (userId: string, accessToken: string, tier: string): Promise<Appointment[]> => {
    const appts = tier === 'free' 
        ? loadApptsLocally()
        : await getApptsDynamo(userId, accessToken);
    
    useUserDataStore.getState().setAppts(appts);
    return appts;
};


export const saveAppt = async (params: PartialAppointment, accessToken: string, tier: string) => {
    const now = new Date().toISOString();
    const tempApptId = UUID.v4() as string;

    const optimisticAppt = createFullAppointment({
        ...params,
        apptId: tempApptId,
        createdAt: now,
        updatedAt: now,
    });
    
    useUserDataStore.getState().addAppt(optimisticAppt);

    try {
        const confirmedAppt = tier === 'free'
            ? saveApptLocally(optimisticAppt)
            : await saveApptToDynamo(optimisticAppt, accessToken)
            
         useUserDataStore.getState().replaceAppt(tempApptId, confirmedAppt.appt);

        return confirmedAppt;
    } catch (error){
        console.error("Failed to save appointment", error);
        useUserDataStore.getState().removeAppt(tempApptId);
        return null;
    }
};



export const updateAppt = async (apptId: string, updatedData: Appointment, accessToken: string, tier: string) => {
    const store = useUserDataStore.getState();

    if (tier === 'free') {
        const updatedAppt = updateApptLocally(updatedData);
        store.replaceAppt(apptId, updatedAppt);
        store.updateAppt(updatedData);

        return updatedAppt;
    } else {
        if (!accessToken) throw new Error('Access token required for remote update');

        // Optimistic update in Zustand
        const prevAppt = store.getApptById(apptId);
        const optimisticAppt = {
        ...prevAppt,
        ...updatedData,
        updatedAt: new Date().toISOString(),
        };

        store.replaceAppt(apptId, optimisticAppt);

        try {
            // Call remote API update
            const response = await updateApptDynamo(updatedData, accessToken);

            if (!response?.apptId) throw new Error('Remote update failed');

            const confirmedAppt = response.apptId;
            // store.replaceAppt(apptId, confirmedAppt);

            // return confirmedAppt;
        } catch (err) {
            console.error('Failed to update appointment:', err);

            // Rollback on error
            if (prevAppt) store.replaceAppt(apptId, prevAppt);

            return null;
        }
    }
};




export const deleteAppt = async (userId: string, apptId: string, clientId: string, accessToken: string, tier: string) => {
    if (tier === "free") {
        return deleteApptLocally(apptId);
    } else if (accessToken && userId) {
        return await deleteAppointment(userId, clientId, apptId, accessToken);
    }
};

