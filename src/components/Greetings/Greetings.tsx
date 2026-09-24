import { Typography } from '@components/Typography';
import { View } from 'react-native';
import { styles } from './Greetings.style';

export const Greetings = () => {
	return (
		<View style={styles.container}>
			<Typography text="TaskFlow" type="h1" bold color="primary" />
			<Typography text="Checkpoint 1: Estructura Base" type="body" color="accent" />
			<Typography text="Hola coder!" type="caption" />
		</View>
	);
};
