import { useState } from 'react';

export const PASSWORD_MIN_LENGTH = 6;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateName = (name: string) => {
	if (!name.trim()) {
		return 'Name is required.';
	}
};

export const validateEmail = (email: string) => {
	const trimmedEmail = email.trim();

	if (!trimmedEmail) {
		return 'Email is required.';
	}
	if (!EMAIL_PATTERN.test(trimmedEmail)) {
		return 'Enter a valid email address.';
	}
};

export const validatePassword = (password: string) => {
	if (!password) {
		return 'Password is required.';
	}
	if (password.length < PASSWORD_MIN_LENGTH) {
		return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
	}
};

type FormValues<Field extends string> = Record<Field, string>;

type FormErrors<Field extends string> = Partial<Record<Field, string>>;

type FormValidators<Field extends string> = Record<Field, (values: FormValues<Field>) => string | undefined>;

export const useAuthForm = <Field extends string>(
	initialValues: FormValues<Field>,
	validators: FormValidators<Field>,
) => {
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState<FormErrors<Field>>({});

	const handleChange = (field: Field, text: string) => {
		setValues((prev) => ({ ...prev, [field]: text }));
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	const handleBlur = (field: Field) => {
		setErrors((prev) => ({ ...prev, [field]: validators[field](values) }));
	};

	const validateAll = () => {
		const fields = Object.keys(validators) as Field[];
		const nextErrors: FormErrors<Field> = {};

		fields.forEach((field) => {
			nextErrors[field] = validators[field](values);
		});
		setErrors(nextErrors);

		return fields.every((field) => !nextErrors[field]);
	};

	return { values, errors, handleChange, handleBlur, validateAll };
};
