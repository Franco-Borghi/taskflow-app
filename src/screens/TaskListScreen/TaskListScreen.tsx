import { Button } from '@components/Button';
import { EmptyState } from '@components/EmptyState';
import { ProfileCard } from '@components/ProfileCard';
import { TaskCard } from '@components/TaskCard';
import { Typography } from '@components/Typography';
import { TasksStackParamList } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectFilteredTasks, toggleTaskStatus } from '@store/taskSlice';
import { FlatList, View } from 'react-native';
import { styles } from './TaskListScreen.styles';

const user = {
	name: 'Franco Borghi',
	role: 'React Native Developer',
	image: require('@assets/images/franco-borghi.jpg'),
};

export const TaskListScreen = () => {
	const navigation = useNavigation<NativeStackNavigationProp<TasksStackParamList, 'TaskList'>>();
	const tasks = useAppSelector(selectFilteredTasks);
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
					<View style={styles.sectionHeader}>
						<Typography text="My tasks" type="h3" bold />
						<Button title="+ Add" size="small" onPress={() => navigation.navigate('TaskForm')} />
					</View>
				</View>
			}
			ListEmptyComponent={
				<EmptyState
					icon="📝"
					title="You have no pending tasks!"
					message="Start by creating one with the + Add button above."
				/>
			}
			style={styles.list}
			contentContainerStyle={styles.listContent}
		/>
	);
};
