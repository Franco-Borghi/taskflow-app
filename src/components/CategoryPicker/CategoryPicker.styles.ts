import { borderRadius } from '@constants/borderRadius';
import { colors } from '@constants/colors';
import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		gap: paddings.small,
	},
	options: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: paddings.small,
	},
	option: {
		paddingHorizontal: paddings.medium,
		paddingVertical: paddings.small,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: borderRadius.rounded,
	},
	optionSelected: {
		backgroundColor: colors.background,
		borderColor: colors.primary,
	},
});
