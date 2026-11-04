import Ionicons from '@expo/vector-icons/Ionicons';
import { CategoryBadge } from '@components/CategoryBadge';
import { Typography } from '@components/Typography';
import { colors } from '@constants/colors';
import { Task } from '@entities/task';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './TaskCard.styles';

const CHECKBOX_SIZE = 24;
const CHECKBOX_HIT_SLOP = 8;

type Props = Pick<Task, 'title' | 'description' | 'category' | 'completed'> & {
	onPress: () => void;
	onToggle: () => void;
};

export const TaskCard = ({ title, description, category, completed, onPress, onToggle }: Props) => {
	return (
		<TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7} accessibilityRole="button">
			<View style={styles.header}>
				<TouchableOpacity
					onPress={onToggle}
					hitSlop={CHECKBOX_HIT_SLOP}
					activeOpacity={0.7}
					accessibilityRole="checkbox"
					accessibilityState={{ checked: completed }}
					accessibilityLabel={completed ? 'Mark as pending' : 'Mark as completed'}
				>
					<Ionicons
						name={completed ? 'checkmark-circle' : 'ellipse-outline'}
						size={CHECKBOX_SIZE}
						color={completed ? colors.primary : colors.textMuted}
					/>
				</TouchableOpacity>
				<View style={styles.title}>
					<Typography text={title} type="body" bold color={completed ? 'textMuted' : 'text'} />
				</View>
				<CategoryBadge category={category} />
			</View>
			<Typography text={description} type="caption" color="textSecondary" />
		</TouchableOpacity>
	);
};
