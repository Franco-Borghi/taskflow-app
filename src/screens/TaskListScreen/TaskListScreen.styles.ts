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
	tasksHeader: {
		gap: paddings.medium,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	loader: {
		paddingVertical: paddings.large,
	},
});
