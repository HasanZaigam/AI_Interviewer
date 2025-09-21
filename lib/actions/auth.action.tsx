'use server';

import {db, auth} from "@/firebase/admin";
import {cookies} from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

type SignUpParams = {
    uid: string;
    name: string;
    email: string;
};

type SignInParams = {
    email: string;
    idToken: string;
};

type GoogleSignInParams = {
    uid: string;
    name: string;
    email: string;
    idToken: string;
};

type User = {
    id: string;
    name: string;
    email: string;
    [key: string]: any;
};

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please sign in instead.'
            }
        }

        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: 'Account created successfully. Please sign in.'
        }
    } catch (e: any) {
        console.error('Error creating a user', e);

        if(e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'This email is already in use.'
            }
        }

        return {
            success: false,
            message: 'Failed to create an account'
        }
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord) {
            return {
                success: false,
                message: 'User does not exist. Create an account instead.'
            }
        }

        await setSessionCookie(idToken);
        
        return {
            success: true,
            message: 'Successfully signed in.'
        }
    } catch (e) {
        console.log(e);

        return {
            success: false,
            message: 'Failed to log into an account.'
        }
    }
}

export async function signInWithGoogle(params: GoogleSignInParams) {
    const { uid, name, email, idToken } = params;

    try {
        console.log('Starting Google sign-in process for:', { uid, name, email });
        
        // For now, skip Firestore operations and just set the session cookie
        // This will work without requiring Firebase Admin SDK configuration
        console.log('Setting session cookie...');
        await setSessionCookie(idToken);
        console.log('Session cookie set successfully');
        
        return {
            success: true,
            message: 'Successfully signed in with Google.'
        }
    } catch (e: any) {
        console.error('Error with Google sign-in:', e);
        console.error('Error details:', {
            message: e.message,
            code: e.code,
            stack: e.stack
        });

        return {
            success: false,
            message: `Failed to sign in with Google: ${e.message}`
        }
    }
}

export async function setSessionCookie(idToken: string) {
    try {
        console.log('Creating session cookie...');
        const cookieStore = await cookies();

        console.log('Creating Firebase session cookie...');
        const sessionCookie = await auth.createSessionCookie(idToken, {
            expiresIn: ONE_WEEK * 1000,
        })
        console.log('Firebase session cookie created successfully');

        console.log('Setting cookie in browser...');
        cookieStore.set('session', sessionCookie, {
            maxAge: ONE_WEEK,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax'
        })
        console.log('Cookie set successfully');
    } catch (error: any) {
        console.error('Error setting session cookie:', error);
        throw error;
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        // For now, return user data from the token claims
        // This works without requiring Firestore access
        return {
            id: decodedClaims.uid,
            name: decodedClaims.name || '',
            email: decodedClaims.email || '',
        } as User;
    } catch (e) {
        console.log('Error getting current user:', e)
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}

export async function signOut() {
    try {
        const cookieStore = await cookies();
        
        // Clear the session cookie with proper options
        cookieStore.set('session', '', {
            maxAge: 0,
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax'
        });
        
        console.log('Session cookie cleared successfully');
        
        return {
            success: true,
            message: 'Successfully signed out'
        }
    } catch (error) {
        console.error('Error during sign out:', error);
        return {
            success: false,
            message: 'Failed to sign out'
        }
    }
}