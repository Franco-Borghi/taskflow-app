import { CategoryBadge } from '@components/CategoryBadge';
import { Typography } from '@components/Typography';
import { Task } from '@entities/task';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './TaskCard.styles';

type Props = Pick<Task, 'title' | 'description' | 'category'> & {
	onPress: () => void;
};

export const TaskCard = ({ title, description, category, onPress }: Props) => {
	return (
		<TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7} accessibilityRole="button">
			<View style={styles.header}>
				<View style={styles.title}>
					<Typography text={title} type="body" bold />
				</View>
				<CategoryBadge category={category} />
			</View>
			<Typography text={description} type="caption" color="textSecondary" />
		</TouchableOpacity>
	);
};
