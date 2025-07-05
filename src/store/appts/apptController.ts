import { Appointment, PartialAppointment } from "@/src/components/types/Service";
import { deleteApptLocally, loadApptsLocally, saveApptLocally, updateApptLocally } from "./apptLocally";
import { getApptsDynamo, saveApptToDynamo, updateApptDynamo } from "./apptDynamo";
import { deleteAppointment } from "@/src/api/appts";
import { useUserDataStore } from "../zustand/useUserDataStore";


export const getAppts = async (userId: string, accessToken: string, tier: string): Promise<Appointment[]> => {
    const appts = tier === 'free' 
        ? loadApptsLocally()
        : await getApptsDynamo(userId, accessToken);
    
    console.log('appts controller', appts)
    useUserDataStore.getState().setAppts(appts);
    return appts;
};

////////Ensure dynamo and mmkv return the same object
export const saveAppt = async (params: PartialAppointment, accessToken: string, tier: string) => {
    const appts = tier === 'free'
        ? saveApptLocally(params)
        : await saveApptToDynamo(params, accessToken)
        
    // useUserDataStore.getState().setAppts(appts);

    return appts;
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

