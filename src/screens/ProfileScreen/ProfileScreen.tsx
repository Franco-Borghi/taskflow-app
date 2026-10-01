import { Layout } from '@components/Layout';
import { FlatList } from 'react-native';
import { styles } from './ProfileScreen.styles';
import { ComponentProps } from 'react';
import { ProfileCard } from '@components/ProfileCard';

type ProfileCardData = ComponentProps<typeof ProfileCard> & { id: string };

const cardData: ProfileCardData[] = [
	{
		id: '0',
		name: 'Franco Borghi',
		role: 'React Native Developer',
		image: require('@assets/images/franco-borghi.jpg'),
	},
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
	return (
		<Layout title="Profile">
			<FlatList
				data={cardData}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <ProfileCard {...item} />}
				style={styles.scroll}
				contentContainerStyle={styles.scrollContent}
			/>
		</Layout>
	);
};
