export const taskFilterLabels = {
	all: 'All',
	pending: 'Pending',
	completed: 'Completed',
};

export type TaskFilter = keyof typeof taskFilterLabels;

export const taskFilters = Object.keys(taskFilterLabels) as TaskFilter[];

export const defaultTaskFilter: TaskFilter = 'all';
