import { borderRadius } from '@constants/borderRadius';
import { colors } from '@constants/colors';
import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	list: {
		flex: 1,
	},
	listContent: {
		padding: paddings.medium,
		gap: paddings.small,
	},
	header: {
		gap: paddings.large,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	emptyState: {
		padding: paddings.large,
		gap: paddings.small,
		backgroundColor: colors.surface,
		borderRadius: borderRadius.small,
		borderWidth: 1,
		borderStyle: 'dashed',
		borderColor: colors.primaryMuted,
	},
});
