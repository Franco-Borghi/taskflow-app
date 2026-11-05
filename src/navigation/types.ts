import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
	Login: undefined;
	Register: undefined;
};

export type TasksStackParamList = {
	TaskList: undefined;
	TaskDetail: { taskId: string };
	TaskForm: { taskId?: string } | undefined;
};

export type RootTabParamList = {
	Home: NavigatorScreenParams<TasksStackParamList>;
	Profile: undefined;
};
