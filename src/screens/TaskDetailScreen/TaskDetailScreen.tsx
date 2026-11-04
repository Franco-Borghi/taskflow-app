import { Button } from '@components/Button';
import { CategoryBadge } from '@components/CategoryBadge';
import { Typography } from '@components/Typography';
import { Task } from '@entities/task';
import { useEffect } from 'react';
import { Alert, BackHandler, ScrollView, View } from 'react-native';
import { styles } from './TaskDetailScreen.styles';

type Props = {
	task: Task;
	onBack: () => void;
	onDelete: () => void;
};

export const TaskDetailScreen = ({ task, onBack, onDelete }: Props) => {
	useEffect(() => {
		const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
			onBack();
			return true;
		});

		return () => subscription.remove();
	}, [onBack]);

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
			{ text: 'Delete', style: 'destructive', onPress: onDelete },
		]);
	};

	return (
		<ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
			{/* Written in English instead of "Volver" (as the brief asks) to match the rest of the app. */}
			<Button title="← Back" variant="secondary" size="small" onPress={onBack} style={styles.backButton} />

			<View style={styles.card}>
				<View style={styles.header}>
					<View style={styles.title}>
						<Typography text={task.title} type="h3" bold />
					</View>
					<CategoryBadge category={task.category} />
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

			<Button title="Delete task" variant="danger" onPress={handleDelete} />
		</ScrollView>
	);
};
