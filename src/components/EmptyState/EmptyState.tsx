import { Typography } from '@components/Typography';
import { View } from 'react-native';
import { styles } from './EmptyState.styles';

type Props = {
	icon: string;
	title: string;
	message: string;
};

export const EmptyState = ({ icon, title, message }: Props) => {
	return (
		<View style={styles.container}>
			<Typography text={icon} type="h1" align="center" />
			<Typography text={title} type="body" bold align="center" />
			<Typography text={message} type="caption" color="textSecondary" align="center" />
		</View>
	);
};
