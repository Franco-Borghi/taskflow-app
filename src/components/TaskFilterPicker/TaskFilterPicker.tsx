import { Typography } from '@components/Typography';
import { TaskFilter, taskFilterLabels, taskFilters } from '@constants/taskFilters';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './TaskFilterPicker.styles';

type Props = {
	value: TaskFilter;
	onChange: (filter: TaskFilter) => void;
};

export const TaskFilterPicker = ({ value, onChange }: Props) => {
	return (
		<View style={styles.container} accessibilityRole="radiogroup">
			{taskFilters.map((filter) => {
				const isSelected = filter === value;

				return (
					<TouchableOpacity
						key={filter}
						style={[styles.option, isSelected && styles.optionSelected]}
						onPress={() => onChange(filter)}
						activeOpacity={0.7}
						accessibilityRole="radio"
						accessibilityState={{ checked: isSelected }}
					>
						<Typography
							text={taskFilterLabels[filter]}
							type="caption"
							bold={isSelected}
							color={isSelected ? 'surface' : 'text'}
						/>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};
