
export interface AuthService {
    // Core functions
    signUp(username: string, password: string, email: string): Promise<any>;
    signIn(username: string, password: string): Promise<any>;
    verifySignUp(email: string, code: string): Promise<string>;
    signOut(): void;
    
    // Mock-only functions
    mockAddUser?: (
      username: string, 
      password: string, 
      confirmed?: boolean, 
      attributes?: Record<string, string>
    ) => void;
    mockSetVerificationCode?: (email: string, code: string) => void;
    mockSetCurrentUser?: (username: string | null) => void;
    mockGetCurrentUser?: () => string | null;
    resetAuthMocks?: () => void;
}