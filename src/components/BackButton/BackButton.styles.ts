import { colors } from '@constants/colors';
import { StyleSheet } from 'react-native';

const SIZE = 28;

export const styles = StyleSheet.create({
	container: {
		width: SIZE,
		height: SIZE,
		borderRadius: SIZE / 2,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.background,
	},
});
