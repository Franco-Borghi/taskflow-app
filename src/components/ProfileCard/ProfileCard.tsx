import Ionicons from '@expo/vector-icons/Ionicons';
import { Typography } from '@components/Typography';
import { colors } from '@constants/colors';
import { Image, ImageSourcePropType, View } from 'react-native';
import { styles } from './ProfileCard.styles';

const AVATAR_ICON_SIZE = 24;

type Props = {
	name: string;
	role: string;
	image?: ImageSourcePropType;
};

export const ProfileCard = ({ name, role, image }: Props) => {
	return (
		<View style={styles.container}>
			{image ? (
				<Image style={styles.image} source={image} />
			) : (
				<View style={[styles.image, styles.avatarPlaceholder]}>
					<Ionicons name="person" size={AVATAR_ICON_SIZE} color={colors.primary} />
				</View>
			)}
			<View style={styles.info}>
				<Typography text={name} type="body" />
				<Typography text={role} type="caption" color="textSecondary" />
			</View>
		</View>
	);
};
