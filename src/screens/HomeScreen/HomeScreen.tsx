import { AddTaskModal } from '@components/AddTaskModal';
import { Button } from '@components/Button';
import { EmptyState } from '@components/EmptyState';
import { Layout } from '@components/Layout';
import { ProfileCard } from '@components/ProfileCard';
import { TaskCard } from '@components/TaskCard';
import { Typography } from '@components/Typography';
import { Task } from '@entities/task';
import { TaskDetailScreen } from '@screens/TaskDetailScreen/TaskDetailScreen';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { styles } from './HomeScreen.styles';

const user = {
	name: 'Franco Borghi',
	role: 'React Native Developer',
	image: require('@assets/images/franco-borghi.jpg'),
};

export const HomeScreen = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);

	const handleSaveTask = (task: Task) => {
		setTasks((prev) => [task, ...prev]);
		setIsAddTaskModalVisible(false);
	};

	const handleDeleteTask = (taskId: string) => {
		setTasks((prev) => prev.filter((task) => task.id !== taskId));
		setSelectedTask(null);
	};

	return (
		<Layout title={selectedTask ? 'Task detail' : 'Home'}>
			{selectedTask ? (
				<TaskDetailScreen
					task={selectedTask}
					onBack={() => setSelectedTask(null)}
					onDelete={() => handleDeleteTask(selectedTask.id)}
				/>
			) : (
				<FlatList
					data={tasks}
					keyExtractor={(task) => task.id}
					renderItem={({ item }) => <TaskCard {...item} onPress={() => setSelectedTask(item)} />}
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
			)}

			<AddTaskModal
				visible={isAddTaskModalVisible}
				onSave={handleSaveTask}
				onCancel={() => setIsAddTaskModalVisible(false)}
			/>
		</Layout>
	);
};
