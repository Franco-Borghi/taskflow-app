import { Typography } from '@components/Typography';
import { colors } from '@constants/colors';
import { Ref, useState } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { styles } from './TextField.styles';

type Props = TextInputProps & {
	label: string;
	error?: string;
	helperText?: string;
	ref?: Ref<TextInput>;
};

export const TextField = ({ label, error, helperText, ref, style, onFocus, onBlur, ...inputProps }: Props) => {
	const [isFocused, setIsFocused] = useState(false);

	const message = error ?? helperText;

	return (
		<View style={styles.container}>
			<Typography text={label} type="caption" bold />
			<TextInput
				ref={ref}
				accessibilityLabel={label}
				placeholderTextColor={colors.textMuted}
				selectionColor={colors.primary}
				{...inputProps}
				style={[styles.input, isFocused && styles.inputFocused, !!error && styles.inputError, style]}
				onFocus={(event) => {
					setIsFocused(true);
					onFocus?.(event);
				}}
				onBlur={(event) => {
					setIsFocused(false);
					onBlur?.(event);
				}}
			/>
			{message ? <Typography text={message} type="small" color={error ? 'error' : 'textMuted'} /> : null}
		</View>
	);
};
