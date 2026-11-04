import { AddTaskModal } from '@components/AddTaskModal';
import { Button } from '@components/Button';
import { EmptyState } from '@components/EmptyState';
import { ProfileCard } from '@components/ProfileCard';
import { TaskCard } from '@components/TaskCard';
import { Typography } from '@components/Typography';
import { Task } from '@entities/task';
import { TasksStackParamList } from '@navigation/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { styles } from './TaskListScreen.styles';

const user = {
	name: 'Franco Borghi',
	role: 'React Native Developer',
	image: require('@assets/images/franco-borghi.jpg'),
};

export const TaskListScreen = () => {
	const navigation = useNavigation<NativeStackNavigationProp<TasksStackParamList, 'TaskList'>>();
	const { params } = useRoute<RouteProp<TasksStackParamList, 'TaskList'>>();
	const deletedTaskId = params?.deletedTaskId;

	const [tasks, setTasks] = useState<Task[]>([]);
	const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
	const [handledDeletedTaskId, setHandledDeletedTaskId] = useState(deletedTaskId);

	if (deletedTaskId !== handledDeletedTaskId) {
		setHandledDeletedTaskId(deletedTaskId);
		setTasks((prev) => prev.filter((task) => task.id !== deletedTaskId));
	}

	const handleSaveTask = (task: Task) => {
		setTasks((prev) => [task, ...prev]);
		setIsAddTaskModalVisible(false);
	};

	return (
		<>
			<FlatList
				data={tasks}
				keyExtractor={(task) => task.id}
				renderItem={({ item }) => (
					<TaskCard {...item} onPress={() => navigation.navigate('TaskDetail', { task: item })} />
				)}
				ListHeaderComponent={
					<View style={styles.header}>
						<ProfileCard {...user} />
						<View style={styles.sectionHeader}>
							<Typography text="My tasks" type="h3" bold />
							<Button title="+ Add" size="small" onPress={() => setIsAddTaskModalVisible(true)} />
						</View>
					</View>
				}
				ListEmptyComponent={
					// Written in English instead of "¡No tienes tareas pendientes! Empieza por crear una arriba."
					// (as the brief asks) to match the rest of the app.
					<EmptyState
						icon="📝"
						title="You have no pending tasks!"
						message="Start by creating one with the + Add button above."
					/>
				}
				style={styles.list}
				contentContainerStyle={styles.listContent}
			/>

			<AddTaskModal
				visible={isAddTaskModalVisible}
				onSave={handleSaveTask}
				onCancel={() => setIsAddTaskModalVisible(false)}
			/>
		</>
	);
};
