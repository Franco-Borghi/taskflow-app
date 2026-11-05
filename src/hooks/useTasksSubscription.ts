import { subscribeToTasks } from '@services/tasksService';
import { selectAuthUser } from '@store/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { tasksLoadFailed, tasksLoading, tasksReceived } from '@store/taskSlice';
import { useEffect } from 'react';

export const useTasksSubscription = () => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectAuthUser)?.uid;

	useEffect(() => {
		if (!userId) {
			return;
		}

		dispatch(tasksLoading());

		return subscribeToTasks(
			userId,
			(tasks) => dispatch(tasksReceived(tasks)),
			(message) => dispatch(tasksLoadFailed(message)),
		);
	}, [dispatch, userId]);
};
