const palette = {
	black: '#0A0A0A',
	gray700: '#404040',
	gray500: '#737373',
	gray300: '#D4D4D4',
	white: '#FFFFFF',

	red600: '#DC2626',

	orange900: '#7C2D12',
	orange600: '#EA580C',
	orange500: '#F97316',
	orange300: '#FDBA74',
	orange100: '#fdf6ed',
};

export const colors = {
	background: palette.orange100,
	surface: palette.white,

	text: palette.black,
	textSecondary: palette.gray700,
	textMuted: palette.gray500,

	border: palette.gray300,
	error: palette.red600,
	backdrop: 'rgba(10, 10, 10, 0.5)',

	primary: palette.orange500,
	primaryPressed: palette.orange600,
	primaryMuted: palette.orange300,
	accent: palette.orange900,
};
