import { Typography } from '@components/Typography';
import { taskCategoryLabels } from '@constants/taskCategories';
import { Task } from '@entities/task';
import { View } from 'react-native';
import { styles } from './TaskCard.styles';

type Props = Pick<Task, 'title' | 'description' | 'category'>;

export const TaskCard = ({ title, description, category }: Props) => {
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.title}>
					<Typography text={title} type="body" bold />
				</View>
				<View style={styles.badge}>
					<Typography text={taskCategoryLabels[category]} type="small" bold color="accent" />
				</View>
			</View>
			<Typography text={description} type="caption" color="textSecondary" />
		</View>
	);
};
