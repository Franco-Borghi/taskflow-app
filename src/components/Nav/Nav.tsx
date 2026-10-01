import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Nav.styles';

export const Nav = () => {
	return (
		<SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
			<View style={styles.content}>{/* TODO: enable navigation icons when navigation is enabled */}</View>
		</SafeAreaView>
	);
};
