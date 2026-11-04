import { borderRadius } from '@constants/borderRadius';
import { colors } from '@constants/colors';
import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		paddingHorizontal: paddings.small,
		paddingVertical: 2,
		backgroundColor: colors.background,
		borderRadius: borderRadius.rounded,
	},
});
