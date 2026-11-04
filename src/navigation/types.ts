import { Task } from '@entities/task';
import { NavigatorScreenParams } from '@react-navigation/native';

export type TasksStackParamList = {
	TaskList: { newTask?: Task; deletedTaskId?: string } | undefined;
	TaskDetail: { task: Task };
	TaskForm: undefined;
};

export type RootTabParamList = {
	Home: NavigatorScreenParams<TasksStackParamList>;
	Profile: undefined;
};
