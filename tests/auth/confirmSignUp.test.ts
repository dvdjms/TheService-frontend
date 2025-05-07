import { confirmSignUp } from '../../src/auth/cognito';

jest.mock('amazon-cognito-identity-js', () => {
    const actual = jest.requireActual('amazon-cognito-identity-js');
  
    return {
      ...actual,
      CognitoUser: jest.fn().mockImplementation(() => ({
        confirmRegistration: (
          code: string,
          forceAliasCreation: boolean,
          callback: (err: Error | null, result: string | null) => void
        ) => {
          if (code === 'valid-code') {
            callback(null, 'Confirmation successful');
          } else {
            callback(new Error('Invalid code'), null);
          }
        },
      })),
      CognitoUserPool: jest.fn().mockImplementation(() => ({
        getCurrentUser: jest.fn(),
      })),
    };
  });
  

describe('confirmSignUp', () => {
  it('should confirm registration successfully with a valid code', async () => {
    await expect(confirmSignUp('test@example.com', 'valid-code')).resolves.toBe('Confirmation successful');
  });

  it('should throw an error for invalid confirmation code', async () => {
    await expect(confirmSignUp('test@example.com', 'invalid-code')).rejects.toThrow('Invalid code');
  });
});
