import { signIn } from '../../src/auth/cognito';

jest.mock('amazon-cognito-identity-js', () => {
  const actual = jest.requireActual('amazon-cognito-identity-js');

  return {
    ...actual,
    CognitoUserPool: jest.fn().mockImplementation(() => ({
      getCurrentUser: jest.fn(), // Optional, in case your logic uses it
    })),
    CognitoUser: jest.fn().mockImplementation(() => ({
      authenticateUser: jest.fn((details, callbacks) => {
        if (
          details.getUsername() === 'test@example.com' &&
          details.getPassword() === 'correct-password'
        ) {
          callbacks.onSuccess('Login success');
        } else {
          callbacks.onFailure(new Error('Login failed'));
        }
      }),
    })),
    AuthenticationDetails: jest.fn((data) => ({
      getUsername: () => data.Username,
      getPassword: () => data.Password,
    })),
  };
});

describe('signIn', () => {
  it('should log in successfully with correct credentials', async () => {
    await expect(signIn('test@example.com', 'correct-password')).resolves.toEqual('Login success');
  });

  it('should fail to log in with incorrect credentials', async () => {
    await expect(signIn('test@example.com', 'wrong-password')).rejects.toThrow('Login failed');
  });
});
