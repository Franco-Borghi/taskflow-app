import { borderRadius } from '@constants/borderRadius';
import { boxShadows } from '@constants/boxShadows';
import { colors } from '@constants/colors';
import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		width: '100%',
		backgroundColor: colors.surface,
		padding: paddings.large,
		borderRadius: borderRadius.small,
		flexDirection: 'row',
		gap: 16,
		borderWidth: 1,
		borderColor: colors.primaryMuted,
		boxShadow: boxShadows.primary,
	},
	image: {
		width: 48,
		aspectRatio: 1,
		borderRadius: borderRadius.rounded,
	},
});
