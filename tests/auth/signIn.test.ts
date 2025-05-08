import { signIn, mockAddUser, resetAuthMocks } from '../../src/auth/authService';

describe('signIn function', () => {
    beforeEach(() => {
        resetAuthMocks?.();
        mockAddUser?.('testuser', 'correctpassword');
    });

    it('should resolve with tokens when credentials are valid', async () => {
        const result = await signIn('testuser', 'correctpassword');
        const idToken = result.getIdToken().getJwtToken();
        const accessToken = result.getAccessToken().getJwtToken();

        expect(idToken).toMatch(/^eyJhbGciOi/);
        expect(result.getIdToken().payload['cognito:username']).toBe('testuser');
        expect(accessToken).toMatch(/^eyJhbGciOi/);
    });

    it('should reject with UserNotFoundException for non-existent users', async () => {
        await expect(signIn('nonexistent', 'password'))
            .rejects.toMatchObject({
                code: 'UserNotFoundException',
                message: 'User Not Found Exception'
            });
    });

    it('should reject with NotAuthorizedException for wrong password', async () => {
        await expect(signIn('testuser', 'wrongpassword'))
            .rejects.toMatchObject({
                code: 'NotAuthorizedException',
                message: 'Not Authorized Exception'
            });
    });

    it('should reject with UserNotConfirmedException for unconfirmed users', async () => {
        mockAddUser?.('unconfirmed', 'password', false);
        await expect(signIn('unconfirmed', 'password'))
            .rejects.toMatchObject({
                code: 'UserNotConfirmedException',
                message: 'User Not Confirmed Exception'
            });
    });

    it('should include custom attributes in the token payload', async () => {
        mockAddUser?.('premiumuser', 'password', true, {
            'custom:subscriptionTier': 'premium'
        });
        
        const result = await signIn('premiumuser', 'password');
        expect(result.getIdToken().payload['custom:subscriptionTier']).toBe('premium');
    });
});
