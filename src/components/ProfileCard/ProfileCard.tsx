import { Typography } from '@components/Typography';
import { Image, View } from 'react-native';
import { styles } from './ProfileCard.styles';

type Props = {
	name: string;
	role: string;
	image: string;
};
export const ProfileCard = ({ name, role, image }: Props) => {
	return (
		<View style={styles.container}>
			<Image style={styles.image} src={image} />
			<View>
				<Typography text={name} type="body" />
				<Typography text={role} type="caption" color="textSecondary" />
			</View>
		</View>
	);
};
