import { Button } from '@components/Button';
import { EmptyState } from '@components/EmptyState';
import { ErrorMessage } from '@components/ErrorMessage';
import { ProfileCard } from '@components/ProfileCard';
import { TaskCard } from '@components/TaskCard';
import { TaskFilterPicker } from '@components/TaskFilterPicker';
import { Typography } from '@components/Typography';
import { colors } from '@constants/colors';
import { TaskFilter } from '@constants/taskFilters';
import { TasksStackParamList } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { selectAuthUser } from '@store/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
	selectFilteredTasks,
	selectTaskFilter,
	selectTasksError,
	selectTasksStatus,
	setFilter,
	toggleTaskStatus,
} from '@store/taskSlice';
import { ActivityIndicator, Alert, FlatList, View } from 'react-native';
import { styles } from './TaskListScreen.styles';

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
	const user = useAppSelector(selectAuthUser);
	const tasks = useAppSelector(selectFilteredTasks);
	const filter = useAppSelector(selectTaskFilter);
	const status = useAppSelector(selectTasksStatus);
	const error = useAppSelector(selectTasksError);
	const dispatch = useAppDispatch();

	const handleToggle = (taskId: string) => {
		dispatch(toggleTaskStatus(taskId))
			.unwrap()
			.catch((message: string) => Alert.alert('Could not update the task', message));
	};

	const renderEmptyComponent = () => {
		if (status === 'error') {
			return undefined;
		}
		if (status === 'ready') {
			return <EmptyState {...emptyStates[filter]} />;
		}

		return <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />;
	};

	return (
		<FlatList
			data={tasks}
			keyExtractor={(task) => task.id}
			renderItem={({ item }) => (
				<TaskCard
					{...item}
					onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
					onToggle={() => handleToggle(item.id)}
				/>
			)}
			ListHeaderComponent={
				<View style={styles.header}>
					<ProfileCard name={user?.displayName || user?.email || ''} role={user?.email ?? ''} />
					<View style={styles.tasksHeader}>
						<View style={styles.sectionHeader}>
							<Typography text="My tasks" type="h3" bold />
							<Button title="+ Add" size="small" onPress={() => navigation.navigate('TaskForm')} />
						</View>
						<TaskFilterPicker value={filter} onChange={(value) => dispatch(setFilter(value))} />
						{status === 'error' && error ? <ErrorMessage message={error} /> : null}
					</View>
				</View>
			}
			ListEmptyComponent={renderEmptyComponent()}
			style={styles.list}
			contentContainerStyle={styles.listContent}
		/>
	);
};
