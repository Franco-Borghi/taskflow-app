import { TaskForm } from '@components/TaskForm';
import { TasksStackParamList } from '@navigation/types';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { styles } from './TaskFormScreen.styles';

export const TaskFormScreen = () => {
	const navigation = useNavigation<NativeStackNavigationProp<TasksStackParamList, 'TaskForm'>>();
	const headerHeight = useHeaderHeight();

	return (
		<KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={headerHeight}>
			<ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
				<View style={styles.card}>
					<TaskForm
						onSave={(task) => navigation.navigate('TaskList', { newTask: task }, { pop: true })}
						onCancel={() => navigation.goBack()}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};
