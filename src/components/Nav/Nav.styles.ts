import { boxShadows } from '@constants/boxShadows';
import { colors } from '@constants/colors';
import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.primary,
		padding: paddings.medium,
		boxShadow: boxShadows.primary,
	},
	content: {
		minHeight: 20,
	},
});
