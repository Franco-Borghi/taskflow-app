import { AuthLayout } from '@components/AuthLayout';
import { Button } from '@components/Button';
import { ErrorMessage } from '@components/ErrorMessage';
import { TextField } from '@components/TextField';
import { Typography } from '@components/Typography';
import { PASSWORD_MIN_LENGTH, useAuthForm, validateEmail, validateName, validatePassword } from '@hooks/useAuthForm';
import { AuthStackParamList } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { clearAuthError, createAccount, selectAuthError, selectIsAuthSubmitting } from '@store/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect, useRef } from 'react';
import { TextInputInstance, TouchableOpacity, View } from 'react-native';
import { styles } from './RegisterScreen.styles';

type Field = 'name' | 'email' | 'password' | 'confirmPassword';

const validatePasswordConfirmation = (password: string, confirmPassword: string) => {
	if (!confirmPassword) {
		return 'Confirm your password.';
	}
	if (confirmPassword !== password) {
		return 'Passwords do not match.';
	}
};

export const RegisterScreen = () => {
	const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Register'>>();
	const dispatch = useAppDispatch();
	const isSubmitting = useAppSelector(selectIsAuthSubmitting);
	const authError = useAppSelector(selectAuthError);
	const emailRef = useRef<TextInputInstance>(null);
	const passwordRef = useRef<TextInputInstance>(null);
	const confirmPasswordRef = useRef<TextInputInstance>(null);

	const { values, errors, handleChange, handleBlur, validateAll } = useAuthForm<Field>(
		{ name: '', email: '', password: '', confirmPassword: '' },
		{
			name: ({ name }) => validateName(name),
			email: ({ email }) => validateEmail(email),
			password: ({ password }) => validatePassword(password),
			confirmPassword: ({ password, confirmPassword }) => validatePasswordConfirmation(password, confirmPassword),
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
		dispatch(
			createAccount({
				name: values.name.trim(),
				email: values.email.trim(),
				password: values.password,
			}),
		);
	};

	return (
		<AuthLayout title="Create account" subtitle="Sign up to keep your tasks safe in the cloud.">
			<TextField
				label="Name"
				placeholder="Your name"
				value={values.name}
				onChangeText={(text) => handleFieldChange('name', text)}
				onBlur={() => handleBlur('name')}
				error={errors.name}
				autoCapitalize="words"
				autoComplete="name"
				textContentType="name"
				returnKeyType="next"
				submitBehavior="submit"
				onSubmitEditing={() => emailRef.current?.focus()}
			/>

			<TextField
				ref={emailRef}
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
				placeholder="Create a password"
				value={values.password}
				onChangeText={(text) => handleFieldChange('password', text)}
				onBlur={() => handleBlur('password')}
				error={errors.password}
				helperText={`At least ${PASSWORD_MIN_LENGTH} characters.`}
				secureTextEntry
				autoCapitalize="none"
				autoCorrect={false}
				autoComplete="new-password"
				textContentType="newPassword"
				returnKeyType="next"
				submitBehavior="submit"
				onSubmitEditing={() => confirmPasswordRef.current?.focus()}
			/>

			<TextField
				ref={confirmPasswordRef}
				label="Confirm password"
				placeholder="Repeat your password"
				value={values.confirmPassword}
				onChangeText={(text) => handleFieldChange('confirmPassword', text)}
				onBlur={() => handleBlur('confirmPassword')}
				error={errors.confirmPassword}
				secureTextEntry
				autoCapitalize="none"
				autoCorrect={false}
				autoComplete="new-password"
				textContentType="newPassword"
				returnKeyType="done"
				onSubmitEditing={handleSubmit}
			/>

			{authError ? <ErrorMessage message={authError} /> : null}

			<Button
				title={isSubmitting ? 'Creating account…' : 'Create account'}
				onPress={handleSubmit}
				disabled={isSubmitting}
			/>

			<View style={styles.footer}>
				<Typography text="Already have an account?" type="caption" color="textSecondary" />
				<TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} accessibilityRole="link" hitSlop={8}>
					<Typography text="Sign in" type="caption" color="primary" bold />
				</TouchableOpacity>
			</View>
		</AuthLayout>
	);
};
