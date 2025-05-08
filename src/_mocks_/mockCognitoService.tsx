// ========================
// Type Definitions (Added missing MockAuthResult)
// ========================
interface MockAuthResult {
    getIdToken: () => {
        getJwtToken: () => string;
        payload: Record<string, any>;
    };
    getAccessToken: () => {
        getJwtToken: () => string;
    };
    getRefreshToken: () => {
        getToken: () => string;
    };
}

interface MockSignUpResult {
    user: {
        getUsername: () => string;
    };
    userConfirmed: boolean;
    userSub: string;
}

interface UserAttributes {
    email?: string;
    'custom:subscriptionTier'?: string;
    [key: string]: string | undefined; // Allow any other string keys
}


interface MockUser {
    username: string;
    passwordHash: string;
    confirmed: boolean;
    attributes: UserAttributes
    createdAt: Date;
}



// ========================
// Enhanced Mock Database
// ========================
export const mockUserDatabase: Record<string, MockUser> = {};
const verificationCodes: Record<string, string> = {};
const activeSessions: Record<string, MockAuthResult> = {};
let currentUser: string | null = null;

// ========================
// Core Improved Functions
// ========================
export function signUp(username: string, password: string, email: string): Promise<MockSignUpResult> {
    return new Promise((resolve, reject) => {
        // Generate and store verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        verificationCodes[email] = verificationCode; // Fix #1: Now used!

        if (!username || !password || !email) {
            reject(new Error('All fields are required'));            
            return;
        }

        if (!username.includes('@')) {
            reject(new Error('Username must be a valid email address'));
            return;
        }

        if (password.length < 8) {
            reject(new Error('Password must be at least 8 characters'));
            return;
        }

        if (mockUserDatabase[username]) {
            reject(new Error('User already exists'));
            return;
        }

        mockUserDatabase[username] = {
            username,
            passwordHash: mockHash(password),
            confirmed: false,
            attributes: {
                'custom:subscriptionTier': 'free',
                'custom:signUpDate': new Date().toISOString()
            },
            createdAt: new Date()
        };

        resolve({
            user: { getUsername: () => username },
            userConfirmed: false,
            userSub: `mock-sub-${crypto.randomUUID()}`
        });
    });
}

export function confirmSignUp(email: string, code: string): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = Object.values(mockUserDatabase).find(u => u.attributes.email === email);
            
            if (!user) {
                reject(Object.assign(new Error('User does not exist'), { code: 'UserNotFoundException' }));
                return;
            }
            
            if (user.confirmed) {
                reject(Object.assign(new Error('User is already confirmed' ), { code: 'AlreadyConfirmedException' }));
                return;
            }
            
            if (code !== verificationCodes[email]) {
                reject(Object.assign(new Error('Invalid verification code'), { code: 'CodeMismatchException' }));
                return;
            }
            
            user.confirmed = true;
            delete verificationCodes[email];
            resolve('SUCCESS');
        }, 150);
    });
}

export function signIn(username: string, password: string): Promise<MockAuthResult> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = mockUserDatabase[username];
            const error = !user ? 'UserNotFoundException' :
                         !user.confirmed ? 'UserNotConfirmedException' :
                         mockHash(password) !== user.passwordHash ? 'NotAuthorizedException' : null;

            if (error) {
                reject({ code: error, message: error.replace(/([A-Z])/g, ' $1').trim() });
                return;
            }

            const authResult = createMockAuthResult(user);
            activeSessions[username] = authResult;
            currentUser = username;
            resolve(authResult);
        }, 150);
    });
}

export function signOut(): boolean {
    if (currentUser) {
        delete activeSessions[currentUser];
        currentUser = null;
        console.log("User signed out");
        return true;
    }
    console.log("No user to sign out");
    return false;
}

// ========================
// Enhanced Test Utilities
// ========================
function createMockAuthResult(user: MockUser): MockAuthResult {
    const payload = {
        sub: `mock-sub-${crypto.randomUUID()}`,
        'cognito:username': user.username,
        email: user.attributes.email,
        ...user.attributes,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
    };

    return {
        getIdToken: () => ({
            getJwtToken: () => generateMockJWT(payload),
            payload
        }),
        getAccessToken: () => ({
            getJwtToken: () => generateMockJWT({...payload, scope: 'aws.cognito.signin.user.admin'})
        }),
        getRefreshToken: () => ({
            getToken: () => `mock-refresh-token-${crypto.randomUUID()}`
        })
    };
}

function generateMockJWT(payload: object): string {
    const header = { alg: 'mock', typ: 'JWT' };
    return [
        Buffer.from(JSON.stringify(header)).toString('base64'),
        Buffer.from(JSON.stringify(payload)).toString('base64'),
        'mock-signature'
    ].join('.');
}

function mockHash(password: string): string {
    return `mock-hash-${Buffer.from(password).toString('base64')}`;
}

// ========================
// Test Helpers (unchanged from your original)
// ========================
export function mockAddUser(
    username: string, 
    password: string, 
    confirmed = true, 
    attributes: UserAttributes = {}
) {
    const email = attributes.email || username;
    mockUserDatabase[username] = {
        username,
        passwordHash: mockHash(password),
        confirmed,
        attributes: {
            ...attributes,
            email,
            'custom:subscriptionTier': attributes['custom:subscriptionTier'] || 'free'
        },
        createdAt: new Date()
    };
}

export function mockSetVerificationCode(email: string, code: string) {
    verificationCodes[email] = code;
}

export function mockSetCurrentUser(username: string | null) {
    currentUser = username;
}

export function mockGetCurrentUser() {
    return currentUser;
}

export function mockGetHash() {
    return mockUserDatabase['test@example.com'].passwordHash;
}

export function mockGetUserDatabase() {
    return mockUserDatabase;
}

export function resetAuthMocks() {
    Object.keys(mockUserDatabase).forEach(key => delete mockUserDatabase[key]);
    Object.keys(verificationCodes).forEach(key => delete verificationCodes[key]);
    Object.keys(activeSessions).forEach(key => delete activeSessions[key]);
    currentUser = null;
}