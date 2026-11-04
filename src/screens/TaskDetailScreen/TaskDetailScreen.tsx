import { Button } from '@components/Button';
import { CategoryBadge } from '@components/CategoryBadge';
import { Typography } from '@components/Typography';
import { TasksStackParamList } from '@navigation/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { deleteTask, selectTaskById, toggleTaskStatus } from '@store/taskSlice';
import { Alert, ScrollView, View } from 'react-native';
import { styles } from './TaskDetailScreen.styles';

export const TaskDetailScreen = () => {
	const navigation = useNavigation<NativeStackNavigationProp<TasksStackParamList, 'TaskDetail'>>();
	const { taskId } = useRoute<RouteProp<TasksStackParamList, 'TaskDetail'>>().params;
	const task = useAppSelector((state) => selectTaskById(state, taskId));
	const dispatch = useAppDispatch();

	if (!task) {
		return null;
	}

	const createdAt = new Date(task.createdAt).toLocaleString('en-US', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	});

	const handleDelete = () => {
		Alert.alert('Delete task', 'This task will be deleted. This action cannot be undone.', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Delete',
				style: 'destructive',
				onPress: () => {
					dispatch(deleteTask(task.id));
					navigation.goBack();
				},
			},
		]);
	};

	return (
		<ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
			<View style={styles.card}>
				<View style={styles.header}>
					<View style={styles.title}>
						<Typography text={task.title} type="h3" bold />
					</View>
					<CategoryBadge category={task.category} />
				</View>

				<View style={styles.field}>
					<Typography text="Status" type="caption" bold />
					<Typography text={task.completed ? 'Completed' : 'Pending'} type="body" color="textSecondary" />
				</View>

				<View style={styles.field}>
					<Typography text="Description" type="caption" bold />
					<Typography text={task.description} type="body" color="textSecondary" />
				</View>

				<View style={styles.field}>
					<Typography text="Created" type="caption" bold />
					<Typography text={createdAt} type="body" color="textSecondary" />
				</View>
			</View>

			<Button
				title="Edit task"
				variant="secondary"
				onPress={() => navigation.navigate('TaskForm', { taskId: task.id })}
			/>
			<Button
				title={task.completed ? 'Mark as pending' : 'Mark as completed'}
				variant={task.completed ? 'secondary' : 'primary'}
				onPress={() => dispatch(toggleTaskStatus(task.id))}
			/>
			<Button title="Delete task" variant="danger" onPress={handleDelete} />
		</ScrollView>
	);
};
