import { defaultTaskCategory, TaskCategory } from '@constants/taskCategories';
import { TaskInput } from '@entities/task';
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

export const useTaskForm = (onSave: (input: TaskInput) => void, initialValues?: TaskInput) => {
	const [title, setTitle] = useState(initialValues?.title ?? '');
	const [description, setDescription] = useState(initialValues?.description ?? '');
	const [category, setCategory] = useState<TaskCategory>(initialValues?.category ?? defaultTaskCategory);
	const [errors, setErrors] = useState<TaskFormErrors>({});

	const hasErrors = Object.values(errors).some(Boolean);

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

	const handleSave = () => {
		const validationErrors = validateForm({ title, description });
		setErrors(validationErrors);

		if (Object.values(validationErrors).some(Boolean)) {
			return;
		}

		onSave({
			title: title.trim(),
			description: description.trim(),
			category,
		});
		Alert.alert('Success', 'Task saved');
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
		handleSave,
	};
};
