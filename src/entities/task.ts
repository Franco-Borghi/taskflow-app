import { TaskCategory } from '@constants/taskCategories';

export type Task = {
	id: string;
	title: string;
	description: string;
	category: TaskCategory;
	createdAt: Date;
};
