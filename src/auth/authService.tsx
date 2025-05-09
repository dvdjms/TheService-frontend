import * as realAuth from './cognitoService';
import * as mockAuth from '../_mocks_/mockCognitoService';
import type { AuthService } from './authTypes';

// USE_MOCK is for testing purposes - change to true for testing
const USE_MOCK = false;
console.log("USE_MOCK", USE_MOCK)

const auth: AuthService = USE_MOCK ? {
    // Core functions
    signUp: mockAuth.signUp,
    signIn: mockAuth.signIn,
    verifySignUp: mockAuth.verifySignUp,
    signOut: mockAuth.signOut,
    
    // Mock helpers
    mockAddUser: mockAuth.mockAddUser,
    mockSetVerificationCode: mockAuth.mockSetVerificationCode,
    mockGetCurrentUser: mockAuth.mockGetCurrentUser,
    mockSetCurrentUser: mockAuth.mockSetCurrentUser,
    resetAuthMocks: mockAuth.resetAuthMocks
} : {
    // Real implementation
    signUp: realAuth.signUp,
    signIn: realAuth.signIn,
    verifySignUp: realAuth.verifySignUp,
    signOut: realAuth.signOut
};

// Export core functions
export const { signUp, signIn, verifySignUp, signOut } = auth;

// Type-safe mock helpers export
export const mockAddUser = USE_MOCK ? mockAuth.mockAddUser : undefined;
export const mockSetVerificationCode = USE_MOCK ? mockAuth.mockSetVerificationCode : undefined;
export const mockGetCurrentUser = USE_MOCK ? mockAuth.mockGetCurrentUser : undefined;
export const mockSetCurrentUser = USE_MOCK ? mockAuth.mockSetCurrentUser : undefined;
export const resetAuthMocks = USE_MOCK ? mockAuth.resetAuthMocks : undefined;
export const mockGetHash = USE_MOCK ? mockAuth.mockGetHash : undefined;
export const mockGetUserDatabase = USE_MOCK ? mockAuth.mockUserDatabase : undefined;
