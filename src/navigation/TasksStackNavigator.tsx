import { BackButton } from '@components/BackButton';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskDetailScreen } from '@screens/TaskDetailScreen/TaskDetailScreen';
import { TaskFormScreen } from '@screens/TaskFormScreen/TaskFormScreen';
import { TaskListScreen } from '@screens/TaskListScreen/TaskListScreen';
import { headerOptions } from './headerOptions';
import { TasksStackParamList } from './types';

const Stack = createNativeStackNavigator<TasksStackParamList>();

export const TasksStackNavigator = () => {
	return (
		<Stack.Navigator
			initialRouteName="TaskList"
			screenOptions={({ navigation }) => ({
				...headerOptions,
				headerLeftBackgroundVisible: false,
				headerLeft: ({ canGoBack }) => (canGoBack ? <BackButton onPress={() => navigation.goBack()} /> : null),
			})}
		>
			<Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Home' }} />
			<Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Task detail' }} />
			<Stack.Screen name="TaskForm" component={TaskFormScreen} options={{ title: 'New task' }} />
		</Stack.Navigator>
	);
};
