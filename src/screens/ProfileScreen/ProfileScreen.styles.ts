import { colors } from '@constants/colors';
import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: paddings.medium,
		backgroundColor: colors.background,
		gap: 24,
	},
	scroll: {
		flex: 1,
	},
	scrollContent: {
		gap: 8,
	},
});
