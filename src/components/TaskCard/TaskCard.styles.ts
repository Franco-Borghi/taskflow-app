import { borderRadius } from '@constants/borderRadius';
import { boxShadows } from '@constants/boxShadows';
import { colors } from '@constants/colors';
import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		padding: paddings.medium,
		gap: paddings.small,
		backgroundColor: colors.surface,
		borderRadius: borderRadius.small,
		borderWidth: 1,
		borderColor: colors.primaryMuted,
		boxShadow: boxShadows.primary,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: paddings.small,
	},
	title: {
		flex: 1,
	},
	badge: {
		paddingHorizontal: paddings.small,
		paddingVertical: 2,
		backgroundColor: colors.background,
		borderRadius: borderRadius.rounded,
	},
});
