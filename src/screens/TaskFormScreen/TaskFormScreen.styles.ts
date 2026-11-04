import { borderRadius } from '@constants/borderRadius';
import { boxShadows } from '@constants/boxShadows';
import { colors } from '@constants/colors';
import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		padding: paddings.medium,
	},
	card: {
		padding: paddings.large,
		backgroundColor: colors.surface,
		borderRadius: borderRadius.small,
		borderWidth: 1,
		borderColor: colors.primaryMuted,
		boxShadow: boxShadows.primary,
	},
});
