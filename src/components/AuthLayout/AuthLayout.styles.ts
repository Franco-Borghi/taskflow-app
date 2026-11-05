import { borderRadius } from '@constants/borderRadius';
import { boxShadows } from '@constants/boxShadows';
import { colors } from '@constants/colors';
import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.background,
	},
	container: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center',
		padding: paddings.medium,
		gap: paddings.large,
	},
	brand: {
		alignItems: 'center',
		gap: paddings.small,
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
});
