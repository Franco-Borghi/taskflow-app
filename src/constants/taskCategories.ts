export const taskCategoryLabels = {
	personal: 'Personal',
	work: 'Work',
	study: 'Study',
};

export type TaskCategory = keyof typeof taskCategoryLabels;

export const taskCategories = Object.keys(taskCategoryLabels) as TaskCategory[];

export const defaultTaskCategory: TaskCategory = 'personal';
