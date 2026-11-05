import { Button } from '@components/Button';
import { ProfileCard } from '@components/ProfileCard';
import { Typography } from '@components/Typography';
import { selectAuthUser, selectIsAuthSubmitting, signOut } from '@store/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { ComponentProps } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { styles } from './ProfileScreen.styles';

type TeamMember = ComponentProps<typeof ProfileCard> & { id: string };

const teamMembers: TeamMember[] = [
	{ id: '1', name: 'Lucía Fernández', role: 'Product Manager', image: { uri: 'https://i.pravatar.cc/150?img=1' } },
	{ id: '2', name: 'Martín González', role: 'Frontend Developer', image: { uri: 'https://i.pravatar.cc/150?img=12' } },
	{ id: '3', name: 'Sofía Martínez', role: 'UX/UI Designer', image: { uri: 'https://i.pravatar.cc/150?img=5' } },
	{ id: '4', name: 'Joaquín Pérez', role: 'Backend Developer', image: { uri: 'https://i.pravatar.cc/150?img=13' } },
	{ id: '5', name: 'Valentina López', role: 'QA Engineer', image: { uri: 'https://i.pravatar.cc/150?img=9' } },
	{ id: '6', name: 'Tomás Rodríguez', role: 'Mobile Developer', image: { uri: 'https://i.pravatar.cc/150?img=14' } },
	{ id: '7', name: 'Camila Sánchez', role: 'Scrum Master', image: { uri: 'https://i.pravatar.cc/150?img=10' } },
	{ id: '8', name: 'Nicolás Romero', role: 'DevOps Engineer', image: { uri: 'https://i.pravatar.cc/150?img=15' } },
	{ id: '9', name: 'Martina Díaz', role: 'Data Analyst', image: { uri: 'https://i.pravatar.cc/150?img=16' } },
	{ id: '10', name: 'Santiago Torres', role: 'Tech Lead', image: { uri: 'https://i.pravatar.cc/150?img=33' } },
	{ id: '11', name: 'Agustina Ruiz', role: 'Marketing Specialist', image: { uri: 'https://i.pravatar.cc/150?img=20' } },
	{
		id: '12',
		name: 'Facundo Álvarez',
		role: 'Full Stack Developer',
		image: { uri: 'https://i.pravatar.cc/150?img=51' },
	},
];

export const ProfileScreen = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectAuthUser);
	const isSubmitting = useAppSelector(selectIsAuthSubmitting);

	const handleSignOut = () => {
		Alert.alert('Sign out', 'Do you want to sign out of TaskFlow?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Sign out',
				style: 'destructive',
				onPress: () => {
					dispatch(signOut())
						.unwrap()
						.catch(() => Alert.alert('Sign out failed', 'Something went wrong. Please try again.'));
				},
			},
		]);
	};

	return (
		<FlatList
			data={teamMembers}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => <ProfileCard {...item} />}
			ListHeaderComponent={
				<View style={styles.header}>
					<View style={styles.section}>
						<ProfileCard name={user?.displayName || user?.email || ''} role={user?.email ?? ''} />
						<Button title="Sign out" variant="secondary" onPress={handleSignOut} disabled={isSubmitting} />
					</View>
					<Typography text="Team" type="h3" bold />
				</View>
			}
			style={styles.scroll}
			contentContainerStyle={styles.scrollContent}
		/>
	);
};
