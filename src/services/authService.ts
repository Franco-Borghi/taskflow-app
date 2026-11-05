import { AuthUser, CreateAccountInput, SignInInput } from '@entities/user';
import { FirebaseError } from 'firebase/app';
import {
	createUserWithEmailAndPassword,
	signOut as firebaseSignOut,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	updateProfile,
	User,
} from 'firebase/auth';
import { auth } from './firebaseConfig';

const authErrorMessages: Record<string, string> = {
	'auth/invalid-credential': 'Incorrect email or password.',
	'auth/invalid-login-credentials': 'Incorrect email or password.',
	'auth/wrong-password': 'Incorrect email or password.',
	'auth/user-not-found': 'Incorrect email or password.',
	'auth/invalid-email': 'The email address is not valid.',
	'auth/email-already-in-use': 'There is already an account with this email.',
	'auth/weak-password': 'The password must have at least 6 characters.',
	'auth/user-disabled': 'This account has been disabled.',
	'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
	'auth/network-request-failed': 'No internet connection. Check your connection and try again.',
};

export const getAuthErrorMessage = (error: unknown) => {
	const code = error instanceof FirebaseError ? error.code : undefined;

	return (code && authErrorMessages[code]) || 'Something went wrong. Please try again.';
};

const toAuthUser = (user: User): AuthUser => ({
	uid: user.uid,
	email: user.email ?? '',
	displayName: user.displayName ?? '',
});

export const subscribeToAuthChanges = (onChange: (user: AuthUser | null) => void) =>
	onAuthStateChanged(auth, (user) => onChange(user ? toAuthUser(user) : null));

export const createAccount = async ({ name, email, password }: CreateAccountInput) => {
	const { user } = await createUserWithEmailAndPassword(auth, email, password);
	await updateProfile(user, { displayName: name });

	return toAuthUser(user);
};

export const signIn = async ({ email, password }: SignInInput) => {
	const { user } = await signInWithEmailAndPassword(auth, email, password);

	return toAuthUser(user);
};

export const signOut = () => firebaseSignOut(auth);
