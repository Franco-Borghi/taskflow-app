import { TaskForm } from '@components/TaskForm';
import { TaskInput } from '@entities/task';
import { TasksStackParamList } from '@navigation/types';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '@store/hooks';
import { addTask } from '@store/taskSlice';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { styles } from './TaskFormScreen.styles';

export const TaskFormScreen = () => {
	const navigation = useNavigation<NativeStackNavigationProp<TasksStackParamList, 'TaskForm'>>();
	const dispatch = useAppDispatch();
	const headerHeight = useHeaderHeight();

	const handleSave = (input: TaskInput) => {
		dispatch(addTask(input));
		navigation.navigate('TaskList', undefined, { pop: true });
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={headerHeight}>
			<ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
				<View style={styles.card}>
					<TaskForm onSave={handleSave} onCancel={() => navigation.goBack()} />
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};
