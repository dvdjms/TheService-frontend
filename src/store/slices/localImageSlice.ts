import { StateCreator } from 'zustand';
import { LocalImagesSlice, useUserDataStore } from '../useUserDataStore';
import { LocalImage } from '@/src/components/types/Service';

export const createLocalImagesSlice: StateCreator<useUserDataStore, [], [], LocalImagesSlice> = (set, get) => ({
    localImages: [],

    setLocalImages: (images: LocalImage[]) => set({ localImages: images }),

    addLocalImage: (image: LocalImage) =>
        set((state) => ({ localImages: [...state.localImages, image] })),

    removeLocalImage: (uri: string) =>
        set((state) => ({
        localImages: state.localImages.filter((img) => img.uri !== uri),
        })),

    markAsUploaded: (uri: string) =>
        set((state) => ({
        localImages: state.localImages.map((img) =>
            img.uri === uri ? { ...img, uploaded: true } : img
        ),
        })),

    clearAllLocalImages: () => set({ localImages: [] }),
});
