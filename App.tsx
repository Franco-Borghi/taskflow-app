import { AppNavigator } from '@navigation/AppNavigator';
import { store } from '@store/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

export default function App() {
	return (
		<Provider store={store}>
			<SafeAreaProvider>
				<AppNavigator />
			</SafeAreaProvider>
		</Provider>
	);
}
