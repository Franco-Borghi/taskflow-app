import { borderRadius } from '@constants/borderRadius';
import { colors } from '@constants/colors';
import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		gap: paddings.small,
	},
	input: {
		minHeight: 48,
		paddingHorizontal: paddings.medium,
		paddingVertical: paddings.small,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: borderRadius.small,
		fontSize: 16,
		color: colors.text,
	},
	inputFocused: {
		borderColor: colors.primary,
	},
	inputError: {
		borderColor: colors.error,
	},
});
