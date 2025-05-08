import { signUp, mockGetUserDatabase } from '../../src/auth/authService';

describe('signUp function', () => {
    beforeEach(() => {
        for (const key in mockGetUserDatabase) {
            delete mockGetUserDatabase[key];
        }
    });

    it('should resolve with user data when valid credentials are provided', async () => {
        const result = await signUp('test@example.com', 'password123', 'test@example.com');
        expect(result.user.getUsername()).toBe('test@example.com');
        expect(result.userConfirmed).toBe(false);
    });

    it('should reject when username is missing', async () => {
        await expect(signUp('', 'password123', 'test@example.com'))
            .rejects.toThrow('All fields are required');
    });

    it('should reject when password is too short', async () => {
        await expect(signUp('test@example.com', 'short', 'test@example.com'))
            .rejects.toThrow('Password must be at least 8 characters');
    });

    it('should reject when username is invalid', async () => {
        await expect(signUp('invalid-email', 'password123', 'invalid-email'))
            .rejects.toThrow('Username must be a valid email address');
    });

    it('should reject non-email usernames', async () => {
        await expect(signUp('not-an-email', 'ValidPass123!', 'test@example.com'))
            .rejects.toThrow('Username must be a valid email address');
    });
    
    it('should store password hashes', async () => {
        await signUp('test@example.com', 'password123', 'test@example.com');
        const db = mockGetUserDatabase!;
        expect(db['test@example.com'].passwordHash).toMatch(/^mock-hash-/);
    });
});
