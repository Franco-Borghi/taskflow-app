import { Layout } from '@components/Layout';
import { ProfileCard } from '@components/ProfileCard';
import { Typography } from '@components/Typography';
import { View } from 'react-native';
import { styles } from './HomeScreen.styles';

const user = {
	name: 'Franco Borghi',
	role: 'React Native Developer',
	image: require('@assets/images/franco-borghi.jpg'),
};

export const HomeScreen = () => {
	return (
		<Layout title="Home">
			<View style={styles.container}>
				<ProfileCard {...user} />

				<View style={styles.section}>
					<Typography text="My tasks" type="h3" bold />
					<View style={styles.emptyState}>
						<Typography text="No tasks yet" type="body" bold align="center" />
						<Typography text="Your tasks will appear here." type="caption" color="textSecondary" align="center" />
					</View>
				</View>
			</View>
		</Layout>
	);
};
