import { Typography } from '@components/Typography';
import { Image, ImageSourcePropType, View } from 'react-native';
import { styles } from './ProfileCard.styles';

type Props = {
	name: string;
	role: string;
	image: ImageSourcePropType;
};
export const ProfileCard = ({ name, role, image }: Props) => {
	return (
		<View style={styles.container}>
			<Image style={styles.image} source={image} />
			<View>
				<Typography text={name} type="body" />
				<Typography text={role} type="caption" color="textSecondary" />
			</View>
		</View>
	);
};
