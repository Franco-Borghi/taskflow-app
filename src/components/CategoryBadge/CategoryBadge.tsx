import { Typography } from '@components/Typography';
import { TaskCategory, taskCategoryLabels } from '@constants/taskCategories';
import { View } from 'react-native';
import { styles } from './CategoryBadge.styles';

type Props = {
	category: TaskCategory;
};

export const CategoryBadge = ({ category }: Props) => {
	return (
		<View style={styles.container}>
			<Typography text={taskCategoryLabels[category]} type="small" bold color="accent" />
		</View>
	);
};
