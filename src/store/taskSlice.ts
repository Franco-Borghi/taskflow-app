import { defaultTaskFilter, TaskFilter } from '@constants/taskFilters';
import { Task } from '@entities/task';
import { createSlice } from '@reduxjs/toolkit';

type TasksState = {
	items: Task[];
	filter: TaskFilter;
};

const sampleTasks: Task[] = [
	{
		id: 'sample-1',
		title: 'Prepare sprint demo',
		description: 'Record a short video of the new navigation flow.',
		category: 'work',
		completed: false,
		createdAt: '2026-11-03T14:00:00.000Z',
	},
	{
		id: 'sample-2',
		title: 'Buy groceries',
		description: 'Milk, eggs, bread and fruit for the week.',
		category: 'personal',
		completed: false,
		createdAt: '2026-11-02T09:30:00.000Z',
	},
	{
		id: 'sample-3',
		title: 'Study Redux Toolkit',
		description: 'Read about createSlice, configureStore and selectors.',
		category: 'study',
		completed: true,
		createdAt: '2026-11-01T18:15:00.000Z',
	},
	{
		id: 'sample-4',
		title: 'Book a dentist appointment',
		description: 'Call the clinic and ask for a morning slot.',
		category: 'personal',
		completed: true,
		createdAt: '2026-10-30T11:00:00.000Z',
	},
];

const initialState: TasksState = {
	items: sampleTasks,
	filter: defaultTaskFilter,
};

const taskSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {},
});

export const tasksReducer = taskSlice.reducer;
