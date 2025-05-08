import {
    confirmSignUp,
    mockAddUser,
    mockSetVerificationCode,
    resetAuthMocks
} from '../../src/auth/authService';

describe('confirmSignUp', () => {
    const testEmail = 'test@example.com';
    const testCode = '654321';
    const testPassword = 'ValidPass123!';

    beforeEach(() => {
        resetAuthMocks?.();
    });

    it('should confirm user with correct code', async () => {

        mockAddUser?.(testEmail, testPassword, false, { email: testEmail });
        mockSetVerificationCode?.(testEmail, testCode);

        const result = await confirmSignUp(testEmail, testCode);

        expect(result).toBe('SUCCESS');
    });


    it('should reject with UserNotFoundException for unknown email', async () => {

        await expect(confirmSignUp('nonexistent@test.com', testCode))
            .rejects.toMatchObject({
                code: 'UserNotFoundException',
                message: 'User does not exist'
            });
    });

    it('should reject with AlreadyConfirmedException for confirmed users', async () => {

        mockAddUser?.(testEmail, testPassword, true, { email: testEmail });
        mockSetVerificationCode?.(testEmail, testCode);

        await expect(confirmSignUp(testEmail, testCode))
            .rejects.toMatchObject({
                code: 'AlreadyConfirmedException',
                message: 'User is already confirmed'
            });
    });

    it('should reject with CodeMismatchException for wrong code', async () => {

        mockAddUser?.(testEmail, testPassword, false, { email: testEmail });
        mockSetVerificationCode?.(testEmail, testCode);

        await expect(confirmSignUp(testEmail, 'wrong-code'))
            .rejects.toMatchObject({
                code: 'CodeMismatchException',
                message: 'Invalid verification code'
            });
    });

    // Edge Cases
    it('should clean up verification code after successful confirmation', async () => {

        mockAddUser?.(testEmail, testPassword, false, { email: testEmail });
        mockSetVerificationCode?.(testEmail, testCode);

        await confirmSignUp(testEmail, testCode);

        await expect(confirmSignUp(testEmail, testCode))
        .rejects.toMatchObject({
            code: expect.stringMatching(/CodeMismatchException|AlreadyConfirmedException/)
        });
    });

    it('should handle concurrent confirmation attempts', async () => {

        mockAddUser?.(testEmail, testPassword, false, { email: testEmail });
        mockSetVerificationCode?.(testEmail, testCode);

        // Run multiple confirmations simultaneously
        const results = await Promise.allSettled([
            confirmSignUp(testEmail, testCode),
            confirmSignUp(testEmail, testCode)
        ]);

        const fulfilled = results.filter(r => r.status === 'fulfilled');
        const rejected = results.filter(r => r.status === 'rejected');
        
        expect(fulfilled).toHaveLength(1); // Only one should succeed
        expect(rejected).toHaveLength(1); // Other should fail
        expect(['CodeMismatchException', 'AlreadyConfirmedException']).toContain(rejected[0].reason.code);
    });
});