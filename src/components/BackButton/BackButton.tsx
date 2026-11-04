import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '@constants/colors';
import { TouchableOpacity } from 'react-native';
import { styles } from './BackButton.styles';

const ICON_SIZE = 17;
const HIT_SLOP = 8;

type Props = {
	onPress: () => void;
};

export const BackButton = ({ onPress }: Props) => {
	return (
		<TouchableOpacity
			style={styles.container}
			onPress={onPress}
			hitSlop={HIT_SLOP}
			activeOpacity={0.7}
			accessibilityRole="button"
			accessibilityLabel="Go back"
		>
			<Ionicons name="chevron-back" size={ICON_SIZE} color={colors.primary} />
		</TouchableOpacity>
	);
};
