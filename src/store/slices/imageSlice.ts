// store/slices/imagesSlice.ts
import { StateCreator } from 'zustand';
import { ImagesSlice, useUserDataStore } from '../useUserDataStore';
import { Image } from '@/src/components/types/Service';


export const createImagesSlice: StateCreator<useUserDataStore, [], [], ImagesSlice> = (set) => ({
    images: [],
    setImages: (images) => set({ images }),
    addImage: (image: Image) => set((state) => ({ images: [...state.images, image] })),
    removeImage: (id: string) => set((state) => ({ images: state.images.filter((img) => img.imageId !== id) })),
    clearImages: () => set({ images: [] }),
});
