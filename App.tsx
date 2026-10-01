import { ProfileScreen } from '@screens/ProfileScreen/ProfileScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
	return (
		<SafeAreaProvider>
			<ProfileScreen />
		</SafeAreaProvider>
	);
}
