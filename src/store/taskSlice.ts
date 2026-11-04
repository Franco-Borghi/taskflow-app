import { defaultTaskFilter, TaskFilter } from '@constants/taskFilters';
import { Task, TaskInput } from '@entities/task';
import { createSelector, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

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
	reducers: {
		addTask: {
			reducer: (state, action: PayloadAction<Task>) => {
				state.items.unshift(action.payload);
			},
			prepare: (input: TaskInput) => ({
				payload: {
					...input,
					id: nanoid(),
					completed: false,
					createdAt: new Date().toISOString(),
				},
			}),
		},
		updateTask: (state, action: PayloadAction<{ id: string; changes: TaskInput }>) => {
			const task = state.items.find((item) => item.id === action.payload.id);

			if (task) {
				Object.assign(task, action.payload.changes);
			}
		},
		toggleTaskStatus: (state, action: PayloadAction<string>) => {
			const task = state.items.find((item) => item.id === action.payload);

			if (task) {
				task.completed = !task.completed;
			}
		},
		deleteTask: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter((task) => task.id !== action.payload);
		},
		setFilter: (state, action: PayloadAction<TaskFilter>) => {
			state.filter = action.payload;
		},
	},
});

export const { addTask, updateTask, toggleTaskStatus, deleteTask, setFilter } = taskSlice.actions;

export const tasksReducer = taskSlice.reducer;

export const selectTasks = (state: RootState) => state.tasks.items;

export const selectTaskById = (state: RootState, taskId: string) =>
	state.tasks.items.find((task) => task.id === taskId);

export const selectTaskFilter = (state: RootState) => state.tasks.filter;

export const selectFilteredTasks = createSelector([selectTasks, selectTaskFilter], (tasks, filter) => {
	if (filter === 'all') {
		return tasks;
	}

	return tasks.filter((task) => task.completed === (filter === 'completed'));
});
