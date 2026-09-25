import { colors } from '@constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		padding: 24,
		gap: 24,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.surface,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: colors.primaryMuted,
	},
});
