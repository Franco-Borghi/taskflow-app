import { paddings } from '@constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	scroll: {
		flex: 1,
	},
	scrollContent: {
		gap: paddings.small,
		padding: paddings.medium,
	},
	header: {
		gap: paddings.large,
		paddingBottom: paddings.small,
	},
	section: {
		gap: paddings.medium,
	},
});
