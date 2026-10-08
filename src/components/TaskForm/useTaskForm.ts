import { defaultTaskCategory, TaskCategory } from '@constants/taskCategories';
import { Task } from '@entities/task';
import { useState } from 'react';
import { Alert } from 'react-native';

export const TITLE_MIN_LENGTH = 5;
export const DESCRIPTION_MIN_LENGTH = 10;

type TaskFormValues = {
	title: string;
	description: string;
};

type TaskFormField = keyof TaskFormValues;

type TaskFormErrors = Partial<Record<TaskFormField, string>>;

// Each validator returns an error message, or undefined when the value is valid.
// Values are trimmed so a field with only spaces counts as empty.
const validateTitle = (title: string) => {
	const trimmedTitle = title.trim();

	if (!trimmedTitle) {
		return 'Title is required.';
	}
	if (trimmedTitle.length < TITLE_MIN_LENGTH) {
		return `Title must be at least ${TITLE_MIN_LENGTH} characters.`;
	}
};

const validateDescription = (description: string) => {
	const trimmedDescription = description.trim();

	if (!trimmedDescription) {
		return 'Description is required.';
	}
	if (trimmedDescription.length < DESCRIPTION_MIN_LENGTH) {
		return `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters.`;
	}
};

const validateForm = ({ title, description }: TaskFormValues): TaskFormErrors => ({
	title: validateTitle(title),
	description: validateDescription(description),
});

export const useTaskForm = (onSave: (task: Task) => void) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState<TaskCategory>(defaultTaskCategory);
	const [errors, setErrors] = useState<TaskFormErrors>({});

	const hasErrors = Object.values(errors).some(Boolean);

	const resetForm = () => {
		setTitle('');
		setDescription('');
		setCategory(defaultTaskCategory);
		setErrors({});
	};

	// Editing a field clears its error; the field is validated again when it loses focus.
	const handleChange = (field: TaskFormField, text: string) => {
		if (field === 'title') {
			setTitle(text);
		} else {
			setDescription(text);
		}
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	const handleBlur = (field: TaskFormField) => {
		const fieldError = validateForm({ title, description })[field];
		setErrors((prev) => ({ ...prev, [field]: fieldError }));
	};

	const handleAddTask = () => {
		// Submitting validates every field, including the ones the user never focused.
		const validationErrors = validateForm({ title, description });
		setErrors(validationErrors);

		if (Object.values(validationErrors).some(Boolean)) {
			return;
		}

		const task: Task = {
			id: Date.now().toString(),
			title: title.trim(),
			description: description.trim(),
			category,
			createdAt: new Date(),
		};
		console.log('New task:', task);
		onSave(task);
		resetForm();
		Alert.alert('Éxito', 'Tarea capturada localmente');
	};

	return {
		title,
		description,
		category,
		setCategory,
		errors,
		hasErrors,
		handleChange,
		handleBlur,
		handleAddTask,
	};
};
