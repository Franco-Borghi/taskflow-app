import { AuthLayout } from '@components/AuthLayout';
import { Button } from '@components/Button';
import { ErrorMessage } from '@components/ErrorMessage';
import { TextField } from '@components/TextField';
import { Typography } from '@components/Typography';
import { useAuthForm, validateEmail, validatePassword } from '@hooks/useAuthForm';
import { AuthStackParamList } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { clearAuthError, selectAuthError, selectIsAuthSubmitting, signIn } from '@store/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect, useRef } from 'react';
import { TextInputInstance, TouchableOpacity, View } from 'react-native';
import { styles } from './LoginScreen.styles';

type Field = 'email' | 'password';

export const LoginScreen = () => {
	const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Login'>>();
	const dispatch = useAppDispatch();
	const isSubmitting = useAppSelector(selectIsAuthSubmitting);
	const authError = useAppSelector(selectAuthError);
	const passwordRef = useRef<TextInputInstance>(null);

	const { values, errors, handleChange, handleBlur, validateAll } = useAuthForm<Field>(
		{ email: '', password: '' },
		{
			email: ({ email }) => validateEmail(email),
			password: ({ password }) => validatePassword(password),
		},
	);

	useEffect(
		() => () => {
			dispatch(clearAuthError());
		},
		[dispatch],
	);

	const handleFieldChange = (field: Field, text: string) => {
		handleChange(field, text);
		if (authError) {
			dispatch(clearAuthError());
		}
	};

	const handleSubmit = () => {
		if (!validateAll()) {
			return;
		}
		dispatch(signIn({ email: values.email.trim(), password: values.password }));
	};

	const goToRegister = () => {
		dispatch(clearAuthError());
		navigation.navigate('Register');
	};

	return (
		<AuthLayout title="Sign in" subtitle="Welcome back! Sign in to see your tasks.">
			<TextField
				label="Email"
				placeholder="you@example.com"
				value={values.email}
				onChangeText={(text) => handleFieldChange('email', text)}
				onBlur={() => handleBlur('email')}
				error={errors.email}
				keyboardType="email-address"
				autoCapitalize="none"
				autoCorrect={false}
				autoComplete="email"
				textContentType="emailAddress"
				returnKeyType="next"
				submitBehavior="submit"
				onSubmitEditing={() => passwordRef.current?.focus()}
			/>

			<TextField
				ref={passwordRef}
				label="Password"
				placeholder="Your password"
				value={values.password}
				onChangeText={(text) => handleFieldChange('password', text)}
				onBlur={() => handleBlur('password')}
				error={errors.password}
				secureTextEntry
				autoCapitalize="none"
				autoCorrect={false}
				autoComplete="current-password"
				textContentType="password"
				returnKeyType="done"
				onSubmitEditing={handleSubmit}
			/>

			{authError ? <ErrorMessage message={authError} /> : null}

			<Button title={isSubmitting ? 'Signing in…' : 'Sign in'} onPress={handleSubmit} disabled={isSubmitting} />

			<View style={styles.footer}>
				<Typography text="Don't have an account?" type="caption" color="textSecondary" />
				<TouchableOpacity onPress={goToRegister} activeOpacity={0.7} accessibilityRole="link" hitSlop={8}>
					<Typography text="Create one" type="caption" color="primary" bold />
				</TouchableOpacity>
			</View>
		</AuthLayout>
	);
};
