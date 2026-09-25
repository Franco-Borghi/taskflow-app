import { Typography } from '@components/Typography';
import { FlatList, View } from 'react-native';
import { styles } from './ProfileScreen.styles';
import { ComponentProps } from 'react';
import { ProfileCard } from '@components/ProfileCard';

type ProfileCardData = ComponentProps<typeof ProfileCard> & { id: string };

const cardData: ProfileCardData[] = [
	{ id: '1', name: 'Lucía Fernández', role: 'Product Manager', image: 'https://i.pravatar.cc/150?img=1' },
	{ id: '2', name: 'Martín González', role: 'Frontend Developer', image: 'https://i.pravatar.cc/150?img=12' },
	{ id: '3', name: 'Sofía Martínez', role: 'UX/UI Designer', image: 'https://i.pravatar.cc/150?img=5' },
	{ id: '4', name: 'Joaquín Pérez', role: 'Backend Developer', image: 'https://i.pravatar.cc/150?img=13' },
	{ id: '5', name: 'Valentina López', role: 'QA Engineer', image: 'https://i.pravatar.cc/150?img=9' },
	{ id: '6', name: 'Tomás Rodríguez', role: 'Mobile Developer', image: 'https://i.pravatar.cc/150?img=14' },
	{ id: '7', name: 'Camila Sánchez', role: 'Scrum Master', image: 'https://i.pravatar.cc/150?img=10' },
	{ id: '8', name: 'Nicolás Romero', role: 'DevOps Engineer', image: 'https://i.pravatar.cc/150?img=15' },
	{ id: '9', name: 'Martina Díaz', role: 'Data Analyst', image: 'https://i.pravatar.cc/150?img=16' },
	{ id: '10', name: 'Santiago Torres', role: 'Tech Lead', image: 'https://i.pravatar.cc/150?img=33' },
	{ id: '11', name: 'Agustina Ruiz', role: 'Marketing Specialist', image: 'https://i.pravatar.cc/150?img=20' },
	{ id: '12', name: 'Facundo Álvarez', role: 'Full Stack Developer', image: 'https://i.pravatar.cc/150?img=51' },
];

export const ProfileScreen = () => {
	return (
		<View style={styles.container}>
			<Typography text="Profile" align="center" type="h1" color="primary" />

			<FlatList
				data={cardData}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <ProfileCard {...item} />}
				style={styles.scroll}
				contentContainerStyle={styles.scrollContent}
			/>
		</View>
	);
};
