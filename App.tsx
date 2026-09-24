import { Greetings } from '@components/Greetings';
import { View } from 'react-native';
import { styles } from './App.styles';

export default function App() {
	return (
		<View style={styles.container}>
			<Greetings />
		</View>
	);
}
