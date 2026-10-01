import { Typography } from '@components/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Header.styles';

type Props = {
	title: string;
};

export const Header = ({ title }: Props) => {
	return (
		<SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
			<Typography text={title} type="h2" bold align="center" color="surface" />
		</SafeAreaView>
	);
};
