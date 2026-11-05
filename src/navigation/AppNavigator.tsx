import { FullScreenLoader } from '@components/FullScreenLoader';
import { colors } from '@constants/colors';
import { DefaultTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { subscribeToAuthChanges } from '@services/authService';
import { authStateChanged, selectAuthStatus } from '@store/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect } from 'react';
import { AuthStackNavigator } from './AuthStackNavigator';
import { MainTabNavigator } from './MainTabNavigator';

const theme: Theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: colors.primary,
		background: colors.background,
		card: colors.surface,
		text: colors.text,
		border: colors.border,
	},
};

export const AppNavigator = () => {
	const dispatch = useAppDispatch();
	const authStatus = useAppSelector(selectAuthStatus);

	useEffect(() => subscribeToAuthChanges((user) => dispatch(authStateChanged(user))), [dispatch]);

	if (authStatus === 'checking') {
		return <FullScreenLoader />;
	}

	return (
		<NavigationContainer theme={theme}>
			{authStatus === 'authenticated' ? <MainTabNavigator /> : <AuthStackNavigator />}
		</NavigationContainer>
	);
};
