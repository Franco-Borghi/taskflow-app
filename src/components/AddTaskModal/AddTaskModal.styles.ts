import { borderRadius } from '@constants/borderRadius';
import { colors } from '@constants/colors';
import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: colors.backdrop,
	},
	safeArea: {
		flex: 1,
		justifyContent: 'center',
		padding: paddings.medium,
	},
	card: {
		maxHeight: '100%',
		backgroundColor: colors.surface,
		borderRadius: borderRadius.medium,
		overflow: 'hidden',
	},
	content: {
		padding: paddings.large,
		gap: paddings.large,
	},
});
