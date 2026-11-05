import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '@constants/colors';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProfileScreen } from '@screens/ProfileScreen/ProfileScreen';
import { headerOptions } from './headerOptions';
import { TasksStackNavigator } from './TasksStackNavigator';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const MainTabNavigator = () => {
	return (
		<Tab.Navigator
			initialRouteName="Home"
			screenOptions={{
				...headerOptions,
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.textMuted,
			}}
		>
			<Tab.Screen
				name="Home"
				component={TasksStackNavigator}
				options={{
					headerShown: false,
					tabBarIcon: ({ focused, color, size }) => (
						<Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={size} />
					),
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					tabBarIcon: ({ focused, color, size }) => (
						<Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={size} />
					),
				}}
			/>
		</Tab.Navigator>
	);
};
