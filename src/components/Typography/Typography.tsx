import { Text, TextStyle } from 'react-native';

import { colors } from '@theme/colors';

import { styles } from './Typography.style';

export type TypographyType = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';

type TypographyProps = {
	text: string;
	type?: TypographyType;
	color?: keyof typeof colors;
	align?: TextStyle['textAlign'];
	bold?: boolean;
};

export const Typography = ({ type = 'body', color = 'text', align, bold = false, text }: TypographyProps) => {
	return (
		<Text style={[styles[type], bold ? styles.bold : styles.regular, { color: colors[color], textAlign: align }]}>
			{text}
		</Text>
	);
};
