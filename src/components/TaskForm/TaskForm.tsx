import { Button } from '@components/Button';
import { CategoryPicker } from '@components/CategoryPicker';
import { TextField } from '@components/TextField';
import { Task } from '@entities/task';
import { useRef } from 'react';
import { TextInput, View } from 'react-native';
import { styles } from './TaskForm.styles';
import { DESCRIPTION_MIN_LENGTH, TITLE_MIN_LENGTH, useTaskForm } from './useTaskForm';

type Props = {
	onSave: (task: Task) => void;
	onCancel: () => void;
};

export const TaskForm = ({ onSave, onCancel }: Props) => {
	const { title, description, category, setCategory, errors, hasErrors, handleChange, handleBlur, handleAddTask } =
		useTaskForm(onSave);

	const descriptionRef = useRef<TextInput>(null);

	return (
		<View style={styles.container}>
			<TextField
				label="Title"
				placeholder="What do you need to do?"
				value={title}
				onChangeText={(text) => handleChange('title', text)}
				onBlur={() => handleBlur('title')}
				error={errors.title}
				helperText={`At least ${TITLE_MIN_LENGTH} characters.`}
				keyboardType="default"
				autoCapitalize="sentences"
				autoCorrect
				returnKeyType="next"
				submitBehavior="submit"
				onSubmitEditing={() => descriptionRef.current?.focus()}
			/>

			<TextField
				ref={descriptionRef}
				label="Description"
				placeholder="Add some details"
				value={description}
				onChangeText={(text) => handleChange('description', text)}
				onBlur={() => handleBlur('description')}
				error={errors.description}
				helperText={`At least ${DESCRIPTION_MIN_LENGTH} characters.`}
				keyboardType="default"
				autoCapitalize="sentences"
				autoCorrect
				multiline
				style={styles.descriptionInput}
			/>

			<CategoryPicker value={category} onChange={setCategory} />

			<View style={styles.actions}>
				<Button title="Cancel" variant="secondary" onPress={onCancel} style={styles.action} />
				<Button title="Save" onPress={handleAddTask} disabled={hasErrors} style={styles.action} />
			</View>
		</View>
	);
};
