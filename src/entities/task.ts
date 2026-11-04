import { TaskCategory } from '@constants/taskCategories';

export type Task = {
	id: string;
	title: string;
	description: string;
	category: TaskCategory;
	completed: boolean;
	createdAt: string;
};

export type TaskInput = Pick<Task, 'title' | 'description' | 'category'>;
