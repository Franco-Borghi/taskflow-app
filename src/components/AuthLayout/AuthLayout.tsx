import Ionicons from '@expo/vector-icons/Ionicons';
import { Typography } from '@components/Typography';
import { colors } from '@constants/colors';
import { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './AuthLayout.styles';

const LOGO_SIZE = 56;

type Props = {
	title: string;
	subtitle: string;
	children: ReactNode;
};

export const AuthLayout = ({ title, subtitle, children }: Props) => {
	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView style={styles.container} behavior="padding">
				<ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
					<View style={styles.brand}>
						<Ionicons name="checkmark-done-circle" size={LOGO_SIZE} color={colors.primary} />
						<Typography text="TaskFlow" type="h1" bold align="center" />
						<Typography text={subtitle} type="body" color="textSecondary" align="center" />
					</View>
					<View style={styles.card}>
						<Typography text={title} type="h3" bold />
						{children}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};
