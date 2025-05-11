import EncryptedStorage from 'react-native-encrypted-storage';

// Key constants for type safety
type StorageKeysType = {
  ID_TOKEN: 'id_token';
  ACCESS_TOKEN: 'access_token';
  REFRESH_TOKEN: 'refresh_token';
};

export const StorageKeys: StorageKeysType = {
  ID_TOKEN: 'id_token',
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

type StorageKeyValues = 'id_token' | 'access_token' | 'refresh_token';

export const SecureStorage = {
    // Store data
    async set<T>(key: StorageKeyValues, value: T): Promise<void> {
        try {
            await EncryptedStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`SecureStorage.set(${key}) failed:`, error);
            throw error;
        }
    },

    // Retrieve data
    async get<T>(key: keyof typeof StorageKeys): Promise<T | null> {
        try {
            const data = await EncryptedStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`SecureStorage.get(${key}) failed:`, error);
            return null;
        }
    },

  // Remove data
    async remove(key: keyof typeof StorageKeys): Promise<void> {
        try {
            await EncryptedStorage.removeItem(key);
        } catch (error) {
            console.error(`SecureStorage.remove(${key}) failed:`, error);
            throw error;
        }
    },

    // Clear all data
    async clear(): Promise<void> {
        try {
            await EncryptedStorage.clear();
        } catch (error) {
            console.error('SecureStorage.clear() failed:', error);
            throw error;
        }
    }
};