import { AuthUser, CreateAccountInput, SignInInput } from '@entities/user';
import { createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit';
import * as authService from '@services/authService';
import { createAppAsyncThunk } from './createAppAsyncThunk';
import type { RootState } from './store';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

// No guardamos el token de Firebase en Redux. El SDK de Firebase lo administra y lo renueva solo
// (vence cada hora), así que una copia en el store quedaría desactualizada. Además, el SDK lo
// adjunta automáticamente en cada pedido a Firestore. Si alguna vez hiciera falta, se pide en el
// momento con auth.currentUser.getIdToken().
type AuthState = {
	user: AuthUser | null;
	status: AuthStatus;
	isSubmitting: boolean;
	error: string | null;
};

const initialState: AuthState = {
	user: null,
	status: 'checking',
	isSubmitting: false,
	error: null,
};

export const createAccount = createAppAsyncThunk(
	'auth/createAccount',
	async (input: CreateAccountInput, { rejectWithValue }) => {
		try {
			return await authService.createAccount(input);
		} catch (error) {
			return rejectWithValue(authService.getAuthErrorMessage(error));
		}
	},
);

export const signIn = createAppAsyncThunk('auth/signIn', async (input: SignInInput, { rejectWithValue }) => {
	try {
		return await authService.signIn(input);
	} catch (error) {
		return rejectWithValue(authService.getAuthErrorMessage(error));
	}
});

export const signOut = createAppAsyncThunk('auth/signOut', async (_: void, { rejectWithValue }) => {
	try {
		await authService.signOut();
	} catch (error) {
		return rejectWithValue(authService.getAuthErrorMessage(error));
	}
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		authStateChanged: (state, action: PayloadAction<AuthUser | null>) => {
			state.user = action.payload;
			state.status = action.payload ? 'authenticated' : 'unauthenticated';
		},
		clearAuthError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createAccount.fulfilled, (state, action) => {
				state.user = action.payload;
				state.status = 'authenticated';
			})
			.addCase(signIn.fulfilled, (state, action) => {
				state.user = action.payload;
				state.status = 'authenticated';
			})
			.addCase(signOut.fulfilled, (state) => {
				state.user = null;
				state.status = 'unauthenticated';
			})
			.addMatcher(isPending(createAccount, signIn, signOut), (state) => {
				state.isSubmitting = true;
				state.error = null;
			})
			.addMatcher(isFulfilled(createAccount, signIn, signOut), (state) => {
				state.isSubmitting = false;
			})
			.addMatcher(isRejected(createAccount, signIn, signOut), (state, action) => {
				state.isSubmitting = false;
				state.error = action.payload ?? 'Something went wrong. Please try again.';
			});
	},
});

export const { authStateChanged, clearAuthError } = authSlice.actions;

export const authReducer = authSlice.reducer;

export const selectAuthUser = (state: RootState) => state.auth.user;

export const selectAuthStatus = (state: RootState) => state.auth.status;

export const selectIsAuthSubmitting = (state: RootState) => state.auth.isSubmitting;

export const selectAuthError = (state: RootState) => state.auth.error;
