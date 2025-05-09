import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'eu-west-2_y541sF3kH',
    ClientId: '772pnddag3h1b8skva2n0pdpak',
};

const userPool = new CognitoUserPool(poolData);

// Sign Up function (with async/await wrapped in a promise)
export function signUp(username: string, password: string, email: string): Promise<any> {
    
    if (!username || !password || !email) {
        throw new Error('All fields are required');
    }

    if (!username.includes('@')) {
        throw new Error('Username must be a valid email address');
    }

    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
    }

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
            onSuccess: (result) => {
                console.log('Sign-in successful:', result);
                resolve(result);
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
export function signOut() {
    const user = userPool.getCurrentUser();
    if (user) {
        user.signOut();
        console.log('User signed out');
    } else {
        console.log('No user to sign out');
    }
}