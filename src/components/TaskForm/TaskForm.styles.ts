import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		gap: paddings.large,
	},
	descriptionInput: {
		minHeight: 100,
		textAlignVertical: 'top',
	},
	actions: {
		flexDirection: 'row',
		gap: paddings.small,
	},
	action: {
		flex: 1,
	},
});
