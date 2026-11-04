import { Task } from '@entities/task';
import { NavigatorScreenParams } from '@react-navigation/native';

export type TasksStackParamList = {
	TaskList: { deletedTaskId?: string } | undefined;
	TaskDetail: { task: Task };
};

export type RootTabParamList = {
	Home: NavigatorScreenParams<TasksStackParamList>;
	Profile: undefined;
};
