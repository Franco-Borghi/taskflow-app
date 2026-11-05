import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyDO-kgPEY1rmvyN_fzdzfkZbIP1GfTq1ng',
	authDomain: 'taskflow-1dcc6.firebaseapp.com',
	projectId: 'taskflow-1dcc6',
	storageBucket: 'taskflow-1dcc6.firebasestorage.app',
	messagingSenderId: '606887618223',
	appId: '1:606887618223:web:bd0983fdbe22a3606d965a',
};

const isFirstInitialization = getApps().length === 0;

const app = isFirstInitialization ? initializeApp(firebaseConfig) : getApp();

export const auth = isFirstInitialization
	? initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
	: getAuth(app);

export const db = getFirestore(app);
