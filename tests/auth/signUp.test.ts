import { signUp } from '../../src/auth/cognito';

jest.mock('amazon-cognito-identity-js', () => {
  const actual = jest.requireActual('amazon-cognito-identity-js');

  return {
    ...actual,
    CognitoUserPool: jest.fn().mockImplementation(() => ({
      signUp: jest.fn((username, password, attributeList, nullValue, callback) => {
        if (username === 'exists@example.com') {
          callback(new Error('User already exists'), null);
        } else if (!/[A-Z]/.test(password)) {
          callback(new Error('InvalidPasswordException: Password must have uppercase characters'), null);
        } else {
          callback(null, {
            user: {
              getUsername: () => username,
            },
          });
        }
      }),
    })),
  };
});

describe('signUp', () => {

  it('should sign up a new user successfully', async () => {
    const result = await signUp('test@example.com', 'Password123!', 'test@example.com');
    expect(result).toHaveProperty('user');
    expect(result.user.getUsername()).toBe('test@example.com');
  });

  it('should fail if user already exists', async () => {
    await expect(signUp('exists@example.com', 'Password123', 'exists@example.com')).rejects.toThrow(
      'User already exists'
    );
  });

  it('should fail if password is invalid', async () => {
    await expect(signUp('new@example.com', 'password123', 'new@example.com')).rejects.toThrow(
      'InvalidPasswordException'
    );
  });
});
