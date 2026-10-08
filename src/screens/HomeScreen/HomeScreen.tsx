import { AddTaskModal } from '@components/AddTaskModal';
import { Button } from '@components/Button';
import { Layout } from '@components/Layout';
import { ProfileCard } from '@components/ProfileCard';
import { TaskCard } from '@components/TaskCard';
import { Typography } from '@components/Typography';
import { Task } from '@entities/task';
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

	const handleSaveTask = (task: Task) => {
		setTasks((prev) => [task, ...prev]);
		setIsAddTaskModalVisible(false);
	};

	return (
		<Layout title="Home">
			<FlatList
				data={tasks}
				keyExtractor={(task) => task.id}
				renderItem={({ item }) => <TaskCard {...item} />}
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
					<View style={styles.emptyState}>
						<Typography text="No tasks yet" type="body" bold align="center" />
						<Typography text="Your tasks will appear here." type="caption" color="textSecondary" align="center" />
					</View>
				}
				style={styles.list}
				contentContainerStyle={styles.listContent}
			/>

			<AddTaskModal
				visible={isAddTaskModalVisible}
				onSave={handleSaveTask}
				onCancel={() => setIsAddTaskModalVisible(false)}
			/>
		</Layout>
	);
};
