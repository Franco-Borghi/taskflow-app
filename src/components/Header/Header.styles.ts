import { boxShadows } from '@constants/boxShadows';
import { colors } from '@constants/colors';
import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		paddingHorizontal: paddings.medium,
		paddingVertical: paddings.small,
		backgroundColor: colors.primary,
		boxShadow: boxShadows.primary,
	},
});
