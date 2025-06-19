import * as SecureStore from 'expo-secure-store';

import { 
    CognitoUserPool, 
    CognitoUser, 
    AuthenticationDetails, 
    CognitoUserAttribute, 
    CognitoUserSession,
    CognitoRefreshToken 
} from 'amazon-cognito-identity-js';


const poolData = {  
    UserPoolId: 'eu-west-2_y541sF3kH',
    ClientId: '772pnddag3h1b8skva2n0pdpak',
};

const userPool = new CognitoUserPool(poolData);

// Sign Up function (with async/await wrapped in a promise)
export function signUp(username: string, password: string, email: string): Promise<any> {
    
    const attributeList = [
        new CognitoUserAttribute({
            Name: 'email',
            Value: email,
        }),
        new CognitoUserAttribute({ 
            Name: 'custom:subscriptionTier', 
            Value: 'free' 
        })
    ];
  
    return new Promise((resolve, reject) => {
        userPool.signUp(username, password, attributeList, [], (err, result) => {
            if (err) {
                console.error('Sign Up Error:', err);
                reject(err);
            } else {
                console.log('Sign Up Successful:', result);
                resolve(result);
            }
        });
    });
}


// Sign In function (with async/await wrapped in a promise)
export function signIn(username: string, password: string) {
    return new Promise((resolve, reject) => {

        const user = new CognitoUser({
            Username: username,
            Pool: userPool,
        });

        const authDetails = new AuthenticationDetails({
            Username: username,
            Password: password,
        });

        user.authenticateUser(authDetails, {
            onSuccess: async (session) => {
                const { idToken, accessToken, refreshToken } = extractTokens(session);

                const userId = session.getIdToken().decodePayload().sub;

                await SecureStore.setItemAsync('user_id', userId);
                await SecureStore.setItemAsync('id_token', idToken);
                await SecureStore.setItemAsync('access_token', accessToken);
                await SecureStore.setItemAsync('refresh_token', refreshToken);

                resolve(session);
            },
            onFailure: (err) => {
                console.error('Sign-in error:', err);
                reject(err);
            },
        });
    });
}


// Confirm email function (with async/await wrapped in a promise)
export function verifySignUp(email: string, code: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const user = new CognitoUser({
            Username: email,
            Pool: userPool,
        });
  
        user.confirmRegistration(code, true, (err, result) => {
            if (err) {
                console.error('Confirmation error:', err);
                reject(err);
            } else {
                console.log('Confirmation success:', result);
                resolve(result);
            }
        });
    });
}


// Sign out user from cognito
export async function signOut() {
    try{
        const user = userPool.getCurrentUser();
        console.log("user", user)
        if (user) {
            user.signOut();
            console.log('User signed out');
        } else {
            console.log('No user to sign out');
        }
    } catch (error) {
        console.error('Sign-out error:', error);
        throw error; 
    }
}


export async function getCurrentUser(): Promise<{
    user: CognitoUser; 
    session: CognitoUserSession;
    userId: string;
} | null> {
    const user = userPool.getCurrentUser();
    if(!user) return null;

    return new Promise((resolve) => {
        user.getSession((err: any, session: CognitoUserSession) => {
            if (err || !session.isValid()) {
                resolve(null);
            } else {
                const userId = session.getIdToken().decodePayload().sub;
                resolve({ user, session, userId });
            }
        });
    });
}


export function refreshSession(refreshTokenStr: string): Promise<CognitoUserSession | null> {
  return new Promise((resolve) => {
    const user = userPool.getCurrentUser();
    if (!user) return resolve(null);

    const refreshToken = new CognitoRefreshToken({ RefreshToken: refreshTokenStr });

    user.refreshSession(refreshToken, (err, session) => {
      if (err || !session?.isValid()) {
        console.error('Failed to refresh session:', err);
        return resolve(null);
      }
      resolve(session);
    });
  });
}

  // helper function
export const extractTokens = (session: CognitoUserSession) => {
    return {
        idToken: session.getIdToken().getJwtToken(),
        accessToken: session.getAccessToken().getJwtToken(),
        refreshToken: session.getRefreshToken().getToken(),
    };
}

  // helper function
export async function getUserSession() {
    const userId = await SecureStore.getItemAsync('user_id');
    const idToken = await SecureStore.getItemAsync('id_token');
    const accessToken = await SecureStore.getItemAsync('access_token');
    const refreshToken = await SecureStore.getItemAsync('refresh_token');
    return { userId, idToken, accessToken, refreshToken };
}
