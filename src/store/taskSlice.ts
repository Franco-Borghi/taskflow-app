import { defaultTaskFilter, TaskFilter } from '@constants/taskFilters';
import { Task, TaskInput } from '@entities/task';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as tasksService from '@services/tasksService';
import { authStateChanged, signOut } from './authSlice';
import { createAppAsyncThunk } from './createAppAsyncThunk';
import type { RootState } from './store';

type TasksStatus = 'idle' | 'loading' | 'ready' | 'error';

type TasksState = {
	items: Task[];
	filter: TaskFilter;
	status: TasksStatus;
	error: string | null;
};

const initialState: TasksState = {
	items: [],
	filter: defaultTaskFilter,
	status: 'idle',
	error: null,
};

const NOT_SIGNED_IN_MESSAGE = 'You need to sign in to manage your tasks.';

const TASK_NOT_FOUND_MESSAGE = 'This task no longer exists.';

export const addTask = createAppAsyncThunk('tasks/addTask', async (input: TaskInput, { getState, rejectWithValue }) => {
	const userId = getState().auth.user?.uid;

	if (!userId) {
		return rejectWithValue(NOT_SIGNED_IN_MESSAGE);
	}

	try {
		await tasksService.createTask(userId, input);
	} catch (error) {
		return rejectWithValue(tasksService.getTasksErrorMessage(error));
	}
});

export const updateTask = createAppAsyncThunk(
	'tasks/updateTask',
	async ({ id, changes }: { id: string; changes: TaskInput }, { rejectWithValue }) => {
		try {
			await tasksService.updateTask(id, changes);
		} catch (error) {
			return rejectWithValue(tasksService.getTasksErrorMessage(error));
		}
	},
);

export const toggleTaskStatus = createAppAsyncThunk(
	'tasks/toggleTaskStatus',
	async (taskId: string, { getState, rejectWithValue }) => {
		const task = selectTaskById(getState(), taskId);

		if (!task) {
			return rejectWithValue(TASK_NOT_FOUND_MESSAGE);
		}

		try {
			await tasksService.setTaskCompleted(taskId, !task.completed);
		} catch (error) {
			return rejectWithValue(tasksService.getTasksErrorMessage(error));
		}
	},
);

export const deleteTask = createAppAsyncThunk('tasks/deleteTask', async (taskId: string, { rejectWithValue }) => {
	try {
		await tasksService.deleteTask(taskId);
	} catch (error) {
		return rejectWithValue(tasksService.getTasksErrorMessage(error));
	}
});

const taskSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		tasksLoading: (state) => {
			state.status = 'loading';
			state.error = null;
		},
		tasksReceived: (state, action: PayloadAction<Task[]>) => {
			state.items = [...action.payload].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
			state.status = 'ready';
			state.error = null;
		},
		tasksLoadFailed: (state, action: PayloadAction<string>) => {
			state.status = 'error';
			state.error = action.payload;
		},
		setFilter: (state, action: PayloadAction<TaskFilter>) => {
			state.filter = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(authStateChanged, (state, action) => {
				if (!action.payload) {
					return initialState;
				}
			})
			.addCase(signOut.fulfilled, () => initialState);
	},
});

export const { tasksLoading, tasksReceived, tasksLoadFailed, setFilter } = taskSlice.actions;

export const tasksReducer = taskSlice.reducer;

export const selectTasks = (state: RootState) => state.tasks.items;

export const selectTaskById = (state: RootState, taskId: string) =>
	state.tasks.items.find((task) => task.id === taskId);

export const selectTaskFilter = (state: RootState) => state.tasks.filter;

export const selectTasksStatus = (state: RootState) => state.tasks.status;

export const selectTasksError = (state: RootState) => state.tasks.error;

export const selectFilteredTasks = createSelector([selectTasks, selectTaskFilter], (tasks, filter) => {
	if (filter === 'all') {
		return tasks;
	}

	return tasks.filter((task) => task.completed === (filter === 'completed'));
});
