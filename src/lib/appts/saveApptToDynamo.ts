import { createAppointment } from "@/src/api/appts";
import { useUserDataStore } from "@/src/store/useUserDataStore";
import { createFullAppointment } from "./appts";
import { PartialAppointment } from "@/src/components/types/Service";
import UUID from 'react-native-uuid';


export const saveApptToDynamo = async (params: PartialAppointment, accessToken: string) => {
    const now = new Date().toISOString();
    const tempApptId = UUID.v4();

    const optimisticAppt = createFullAppointment({
        ...params,
        apptId: tempApptId,
        createdAt: now,
        updatedAt: now,
    });

    useUserDataStore.getState().addAppt(optimisticAppt);

    try {
        const response = await createAppointment(accessToken, params);
        const apptId = response.appointment?.ToolboxItem?.apptId;

        if (!response || !apptId) {
            throw new Error("Failed to get appointment ID from server");
        }

        const confirmedAppt = createFullAppointment({
            ...optimisticAppt,
            apptId,
        });

        useUserDataStore.getState().replaceAppt(tempApptId, confirmedAppt);

        return confirmedAppt;
    } catch (error) {
        console.error("Failed to save appointment to Dynamo", error);
        // Rollback optimistic update
        useUserDataStore.getState().removeAppt(tempApptId);
        return null;
    }
};

