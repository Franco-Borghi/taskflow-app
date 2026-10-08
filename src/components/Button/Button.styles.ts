import { borderRadius } from '@constants/borderRadius';
import { boxShadows } from '@constants/boxShadows';
import { colors } from '@constants/colors';
import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderRadius: borderRadius.rounded,
	},
	primary: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
		boxShadow: boxShadows.primary,
	},
	secondary: {
		backgroundColor: colors.surface,
		borderColor: colors.border,
	},
	medium: {
		paddingVertical: paddings.medium,
		paddingHorizontal: paddings.large,
	},
	small: {
		paddingVertical: paddings.small,
		paddingHorizontal: paddings.medium,
	},
	disabled: {
		opacity: 0.5,
	},
});
