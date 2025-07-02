import { StateCreator } from 'zustand';
import { useUserDataStore, UserSlice } from '../useUserDataStore';
import { User } from '@/src/components/types/Service';

export const createUserSlice: StateCreator<useUserDataStore, [], [], UserSlice> = (set) => ({
    user: null,
    setUser: (user: User) => set({ user: user }),
    clearUser: () => set({ user: null }),
    updateUser: (updated: User) =>
        set((state) => ({
            user: { ...state.user, ...updated } as User,
        })),
});
