import { colors } from '@constants/colors';
import { ActivityIndicator, View } from 'react-native';
import { styles } from './FullScreenLoader.styles';

export const FullScreenLoader = () => {
	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color={colors.primary} />
		</View>
	);
};
