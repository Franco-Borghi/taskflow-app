import { Typography } from '@components/Typography';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { styles } from './Button.styles';

type Props = {
	title: string;
	onPress: () => void;
	variant?: 'primary' | 'secondary';
	size?: 'medium' | 'small';
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
};

export const Button = ({ title, onPress, variant = 'primary', size = 'medium', disabled = false, style }: Props) => {
	return (
		<TouchableOpacity
			style={[styles.container, styles[variant], styles[size], disabled && styles.disabled, style]}
			onPress={onPress}
			disabled={disabled}
			activeOpacity={0.7}
			accessibilityRole="button"
			accessibilityState={{ disabled }}
		>
			<Typography
				text={title}
				type={size === 'small' ? 'caption' : 'body'}
				bold
				align="center"
				color={variant === 'primary' ? 'surface' : 'text'}
			/>
		</TouchableOpacity>
	);
};
