// In your shared mock file
// import { CognitoUser, CognitoUserPool, AuthenticationDetails } from 'amazon-cognito-identity-js';

// // Use jest.mock to mock the modules
// jest.mock('amazon-cognito-identity-js', () => {
//     return {
//         CognitoUser: jest.fn().mockImplementation(() => ({
//             confirmRegistration: jest.fn((code, forceAliasCreation, callback) => {
//                 if (code === 'valid-code') {
//                     callback(null, 'Confirmation successful');
//                 } else {
//                     callback(new Error('Invalid code'));
//                 }
//             }),
//         })),
//         CognitoUserPool: jest.fn().mockImplementation(() => ({
//             signUp: jest.fn((email, password, attrList, nullValue, callback) => {
//                 if (email === 'exists@example.com') {
//                     callback(new Error('User already exists'), null);
//                 } else {
//                     callback(null, { user: { getUsername: () => email } });
//                 }
//             }),
//             getCurrentUser: jest.fn(),
//         })),
//         AuthenticationDetails: jest.fn((data) => data),
//     };
// });

// // Optionally reset mocks before each test to ensure clean test state
// beforeEach(() => {
//     jest.resetAllMocks();  // or jest.clearAllMocks()
// });
