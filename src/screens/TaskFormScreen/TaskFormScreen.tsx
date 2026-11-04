import { TaskForm } from '@components/TaskForm';
import { TaskInput } from '@entities/task';
import { TasksStackParamList } from '@navigation/types';
import { useHeaderHeight } from '@react-navigation/elements';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { addTask, selectTaskById, updateTask } from '@store/taskSlice';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { styles } from './TaskFormScreen.styles';

export const TaskFormScreen = () => {
	const navigation = useNavigation<NativeStackNavigationProp<TasksStackParamList, 'TaskForm'>>();
	const taskId = useRoute<RouteProp<TasksStackParamList, 'TaskForm'>>().params?.taskId;
	const taskToEdit = useAppSelector((state) => (taskId ? selectTaskById(state, taskId) : undefined));
	const dispatch = useAppDispatch();
	const headerHeight = useHeaderHeight();

	const handleSave = (input: TaskInput) => {
		if (taskToEdit) {
			dispatch(updateTask({ id: taskToEdit.id, changes: input }));
			navigation.goBack();
		} else {
			dispatch(addTask(input));
			navigation.navigate('TaskList', undefined, { pop: true });
		}
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={headerHeight}>
			<ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
				<View style={styles.card}>
					<TaskForm initialValues={taskToEdit} onSave={handleSave} onCancel={() => navigation.goBack()} />
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};
