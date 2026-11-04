import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskListScreen } from '@screens/TaskListScreen/TaskListScreen';
import { headerOptions } from './headerOptions';
import { TasksStackParamList } from './types';

const Stack = createNativeStackNavigator<TasksStackParamList>();

export const TasksStackNavigator = () => {
	return (
		<Stack.Navigator initialRouteName="TaskList" screenOptions={headerOptions}>
			<Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Home' }} />
		</Stack.Navigator>
	);
};
