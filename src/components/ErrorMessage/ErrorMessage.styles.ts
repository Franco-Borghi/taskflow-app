import { borderRadius } from '@constants/borderRadius';
import { colors } from '@constants/colors';
import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: paddings.small,
		padding: paddings.medium,
		borderWidth: 1,
		borderColor: colors.error,
		borderRadius: borderRadius.small,
		backgroundColor: colors.surface,
	},
	text: {
		flex: 1,
	},
});
