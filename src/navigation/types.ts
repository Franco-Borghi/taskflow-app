import { NavigatorScreenParams } from '@react-navigation/native';

export type TasksStackParamList = {
	TaskList: undefined;
};

export type RootTabParamList = {
	Home: NavigatorScreenParams<TasksStackParamList>;
	Profile: undefined;
};
