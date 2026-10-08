import { HomeScreen } from '@screens/HomeScreen/HomeScreen';
// import { ProfileScreen } from '@screens/ProfileScreen/ProfileScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
	return (
		<SafeAreaProvider>
			{/* <ProfileScreen /> */}
			<HomeScreen />
		</SafeAreaProvider>
	);
}
