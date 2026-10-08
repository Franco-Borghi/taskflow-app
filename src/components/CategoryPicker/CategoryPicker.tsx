import { Typography } from '@components/Typography';
import { TaskCategory, taskCategories, taskCategoryLabels } from '@constants/taskCategories';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './CategoryPicker.styles';

type Props = {
	value: TaskCategory;
	onChange: (category: TaskCategory) => void;
};

export const CategoryPicker = ({ value, onChange }: Props) => {
	return (
		<View style={styles.container}>
			<Typography text="Category" type="caption" bold />
			<View style={styles.options} accessibilityRole="radiogroup">
				{taskCategories.map((category) => {
					const isSelected = category === value;

					return (
						<TouchableOpacity
							key={category}
							style={[styles.option, isSelected && styles.optionSelected]}
							onPress={() => onChange(category)}
							activeOpacity={0.7}
							accessibilityRole="radio"
							accessibilityState={{ checked: isSelected }}
						>
							<Typography text={taskCategoryLabels[category]} type="caption" bold={isSelected} color={'text'} />
						</TouchableOpacity>
					);
				})}
			</View>
		</View>
	);
};
