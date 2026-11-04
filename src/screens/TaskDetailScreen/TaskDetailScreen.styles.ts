import { borderRadius } from '@constants/borderRadius';
import { boxShadows } from '@constants/boxShadows';
import { colors } from '@constants/colors';
import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	scroll: {
		flex: 1,
	},
	scrollContent: {
		padding: paddings.medium,
		gap: paddings.medium,
	},
	card: {
		padding: paddings.large,
		gap: paddings.large,
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
	field: {
		gap: paddings.small,
	},
});
