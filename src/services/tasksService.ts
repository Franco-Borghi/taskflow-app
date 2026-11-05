import { defaultTaskCategory, TaskCategory, taskCategories } from '@constants/taskCategories';
import { Task, TaskInput } from '@entities/task';
import { FirebaseError } from 'firebase/app';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	DocumentData,
	onSnapshot,
	query,
	QueryDocumentSnapshot,
	updateDoc,
	where,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const TASKS_COLLECTION = 'tasks';

const tasksErrorMessages: Record<string, string> = {
	'permission-denied': "You don't have permission to access these tasks.",
	unauthenticated: 'Your session has expired. Sign in again.',
	unavailable: 'No internet connection. Your changes will sync when you are back online.',
	'deadline-exceeded': 'The server took too long to respond. Try again.',
};

export const getTasksErrorMessage = (error: unknown) => {
	const code = error instanceof FirebaseError ? error.code : undefined;

	return (code && tasksErrorMessages[code]) || 'Something went wrong with your tasks. Please try again.';
};

const isTaskCategory = (value: unknown): value is TaskCategory => taskCategories.includes(value as TaskCategory);

const toTask = (snapshot: QueryDocumentSnapshot<DocumentData>): Task => {
	const data = snapshot.data();

	return {
		id: snapshot.id,
		title: typeof data.title === 'string' ? data.title : '',
		description: typeof data.description === 'string' ? data.description : '',
		category: isTaskCategory(data.category) ? data.category : defaultTaskCategory,
		completed: data.completed === true,
		createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date(0).toISOString(),
	};
};

export const subscribeToTasks = (
	userId: string,
	onChange: (tasks: Task[]) => void,
	onError: (message: string) => void,
) =>
	onSnapshot(
		query(collection(db, TASKS_COLLECTION), where('userId', '==', userId)),
		(snapshot) => onChange(snapshot.docs.map(toTask)),
		(error) => onError(getTasksErrorMessage(error)),
	);

export const createTask = async (userId: string, { title, description, category }: TaskInput) => {
	await addDoc(collection(db, TASKS_COLLECTION), {
		userId,
		title,
		description,
		category,
		completed: false,
		createdAt: new Date().toISOString(),
	});
};

export const updateTask = async (taskId: string, { title, description, category }: TaskInput) => {
	await updateDoc(doc(db, TASKS_COLLECTION, taskId), { title, description, category });
};

export const setTaskCompleted = async (taskId: string, completed: boolean) => {
	await updateDoc(doc(db, TASKS_COLLECTION, taskId), { completed });
};

export const deleteTask = async (taskId: string) => {
	await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
};
