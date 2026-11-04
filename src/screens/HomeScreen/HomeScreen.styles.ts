import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	list: {
		flex: 1,
	},
	listContent: {
		padding: paddings.medium,
		gap: paddings.small,
	},
	header: {
		gap: paddings.large,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});
