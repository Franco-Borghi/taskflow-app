import { Button } from '@components/Button';
import { EmptyState } from '@components/EmptyState';
import { ProfileCard } from '@components/ProfileCard';
import { TaskCard } from '@components/TaskCard';
import { TaskFilterPicker } from '@components/TaskFilterPicker';
import { Typography } from '@components/Typography';
import { TaskFilter } from '@constants/taskFilters';
import { TasksStackParamList } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectFilteredTasks, selectTaskFilter, setFilter, toggleTaskStatus } from '@store/taskSlice';
import { FlatList, View } from 'react-native';
import { styles } from './TaskListScreen.styles';

const user = {
	name: 'Franco Borghi',
	role: 'React Native Developer',
	image: require('@assets/images/franco-borghi.jpg'),
};

const emptyStates: Record<TaskFilter, { icon: string; title: string; message: string }> = {
	all: {
		icon: '📝',
		title: 'You have no pending tasks!',
		message: 'Start by creating one with the + Add button above.',
	},
	pending: {
		icon: '🎉',
		title: 'No pending tasks',
		message: 'Everything is done. Create a new task with the + Add button above.',
	},
	completed: {
		icon: '✅',
		title: 'No completed tasks yet',
		message: 'Mark a task as completed and it will show up here.',
	},
};

export const TaskListScreen = () => {
	const navigation = useNavigation<NativeStackNavigationProp<TasksStackParamList, 'TaskList'>>();
	const tasks = useAppSelector(selectFilteredTasks);
	const filter = useAppSelector(selectTaskFilter);
	const dispatch = useAppDispatch();

	return (
		<FlatList
			data={tasks}
			keyExtractor={(task) => task.id}
			renderItem={({ item }) => (
				<TaskCard
					{...item}
					onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
					onToggle={() => dispatch(toggleTaskStatus(item.id))}
				/>
			)}
			ListHeaderComponent={
				<View style={styles.header}>
					<ProfileCard {...user} />
					<View style={styles.tasksHeader}>
						<View style={styles.sectionHeader}>
							<Typography text="My tasks" type="h3" bold />
							<Button title="+ Add" size="small" onPress={() => navigation.navigate('TaskForm')} />
						</View>
						<TaskFilterPicker value={filter} onChange={(value) => dispatch(setFilter(value))} />
					</View>
				</View>
			}
			ListEmptyComponent={<EmptyState {...emptyStates[filter]} />}
			style={styles.list}
			contentContainerStyle={styles.listContent}
		/>
	);
};
