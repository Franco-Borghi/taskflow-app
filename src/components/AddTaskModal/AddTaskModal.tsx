import { TaskForm } from '@components/TaskForm';
import { Typography } from '@components/Typography';
import { Task } from '@entities/task';
import { KeyboardAvoidingView, Modal, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './AddTaskModal.styles';

type Props = {
	visible: boolean;
	onSave: (task: Task) => void;
	onCancel: () => void;
};

export const AddTaskModal = ({ visible, onSave, onCancel }: Props) => {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			statusBarTranslucent
			navigationBarTranslucent
			onRequestClose={onCancel}
		>
			<KeyboardAvoidingView style={styles.backdrop} behavior="padding">
				<SafeAreaView style={styles.safeArea}>
					<View style={styles.card}>
						<ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
							<Typography text="New task" type="h3" bold />
							<TaskForm onSave={onSave} onCancel={onCancel} />
						</ScrollView>
					</View>
				</SafeAreaView>
			</KeyboardAvoidingView>
		</Modal>
	);
};
