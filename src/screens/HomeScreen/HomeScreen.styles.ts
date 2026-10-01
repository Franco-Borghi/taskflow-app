import { borderRadius } from '@constants/borderRadius';
import { colors } from '@constants/colors';
import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: paddings.medium,
		gap: paddings.large,
	},
	section: {
		gap: paddings.small,
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
