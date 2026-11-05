import Ionicons from '@expo/vector-icons/Ionicons';
import { Typography } from '@components/Typography';
import { colors } from '@constants/colors';
import { View } from 'react-native';
import { styles } from './ErrorMessage.styles';

const ICON_SIZE = 20;

type Props = {
	message: string;
};

export const ErrorMessage = ({ message }: Props) => {
	return (
		<View style={styles.container} accessibilityRole="alert">
			<Ionicons name="alert-circle" size={ICON_SIZE} color={colors.error} />
			<View style={styles.text}>
				<Typography text={message} type="caption" color="error" />
			</View>
		</View>
	);
};
