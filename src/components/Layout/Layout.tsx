import { Header } from '@components/Header';
import { Nav } from '@components/Nav';
import { ReactNode } from 'react';
import { View } from 'react-native';
import { styles } from './Layout.styles';

type Props = {
	title: string;
	children: ReactNode;
};

export const Layout = ({ title, children }: Props) => {
	return (
		<View style={styles.container}>
			<Header title={title} />
			<View style={styles.content}>{children}</View>
			<Nav />
		</View>
	);
};
