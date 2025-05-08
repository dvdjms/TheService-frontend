import { signOut, mockGetCurrentUser, mockSetCurrentUser, resetAuthMocks } from '../../src/auth/authService';

describe('signOut', () => {
    beforeEach(() => {
        resetAuthMocks?.();
    });

    it('should sign out when a user is logged in', () => {

        mockSetCurrentUser?.('testuser');
        const consoleSpy = jest.spyOn(console, 'log');
        const result = signOut();

        expect(result).toBe(true);
        expect(consoleSpy).toHaveBeenCalledWith('User signed out');
        expect(mockGetCurrentUser?.()).toBeNull();
    });

    it('should handle case when no user is logged in', () => {

        mockSetCurrentUser?.(null);
        const consoleSpy = jest.spyOn(console, 'log');
        const result = signOut();
        
        expect(result).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith('No user to sign out');
    });

    it('should clear current user session', () => {

        mockSetCurrentUser?.('testuser');
        
        signOut();
        
        expect(mockGetCurrentUser?.()).toBeNull();
    });
});