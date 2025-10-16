/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
		extend: {
			// Enhanced spacing system based on 4px grid
			spacing: {
				'0.5': '0.125rem',    // 2px
				'1': '0.25rem',       // 4px
				'1.5': '0.375rem',    // 6px
				'2': '0.5rem',        // 8px
				'2.5': '0.625rem',    // 10px
				'3': '0.75rem',       // 12px
				'3.5': '0.875rem',    // 14px
				'4': '1rem',          // 16px
				'5': '1.25rem',       // 20px
				'6': '1.5rem',        // 24px
				'7': '1.75rem',       // 28px
				'8': '2rem',          // 32px
				'9': '2.25rem',       // 36px
				'10': '2.5rem',       // 40px
				'11': '2.75rem',      // 44px
				'12': '3rem',         // 48px
				'14': '3.5rem',       // 56px
				'16': '4rem',         // 64px
				'18': '4.5rem',       // 72px
				'20': '5rem',         // 80px
				'24': '6rem',         // 96px
				'28': '7rem',         // 112px
				'32': '8rem',         // 128px
				'36': '9rem',         // 144px
				'40': '10rem',        // 160px
				'44': '11rem',        // 176px
				'48': '12rem',        // 192px
				'52': '13rem',        // 208px
				'56': '14rem',        // 224px
				'60': '15rem',        // 240px
				'64': '16rem',        // 256px
				'72': '18rem',        // 288px
				'80': '20rem',        // 320px
				'88': '22rem',        // 352px
				'96': '24rem',        // 384px
				'128': '32rem',       // 512px
			},
			
			// Enhanced typography system
			fontFamily: {
				'sans': ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				'mono': ['ui-monospace', 'SFMono-Regular', 'monospace'],
			},
			
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],      // 12px
				'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],  // 14px
				'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0.025em' }],     // 16px
				'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0.025em' }],  // 18px
				'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '0.025em' }],   // 20px
				'2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '0.025em' }],      // 24px
				'3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '0.025em' }], // 30px
				'4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '0.025em' }],   // 36px
				'5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '0.025em' }],         // 48px
				'6xl': ['3.75rem', { lineHeight: '1.2', letterSpacing: '0.025em' }],      // 60px
				'7xl': ['4.5rem', { lineHeight: '1.2', letterSpacing: '0.025em' }],       // 72px
				'8xl': ['6rem', { lineHeight: '1.2', letterSpacing: '0.025em' }],         // 96px
				'9xl': ['8rem', { lineHeight: '1.2', letterSpacing: '0.025em' }],         // 128px
			},
			
			fontWeight: {
				'thin': '100',
				'extralight': '200',
				'light': '300',
				'normal': '400',
				'medium': '500',
				'semibold': '600',
				'bold': '700',
				'extrabold': '800',
				'black': '900',
			},
			
			lineHeight: {
				'tight': '1.25',
				'snug': '1.375',
				'normal': '1.5',
				'relaxed': '1.625',
				'loose': '2',
			},
			
			letterSpacing: {
				'tighter': '-0.05em',
				'tight': '-0.025em',
				'normal': '0em',
				'wide': '0.025em',
				'wider': '0.05em',
				'widest': '0.1em',
			},
			
			// Enhanced border radius system
			borderRadius: {
				'none': '0',
				'sm': '0.125rem',     // 2px
				'DEFAULT': '0.25rem',  // 4px
				'md': '0.375rem',      // 6px
				'lg': '0.5rem',        // 8px
				'xl': '0.75rem',       // 12px
				'2xl': '1rem',         // 16px
				'3xl': '1.5rem',       // 24px
				'4xl': '2rem',         // 32px
				'full': '9999px',
			},
			
			// Enhanced shadows system
			boxShadow: {
				'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
				'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
				'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
				'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
				'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
				'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
				'none': 'none',
			},
			
			// Enhanced screens
			screens: {
				'xs': '475px',
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1536px',
				'3xl': '1600px',
				'4xl': '1920px',
			},
			
			// Enhanced container
			container: {
				center: true,
				padding: {
					DEFAULT: '1rem',    // 16px
					sm: '1.5rem',       // 24px
					md: '2rem',         // 32px
					lg: '3rem',         // 48px
					xl: '4rem',         // 64px
					'2xl': '5rem',      // 80px
				},
				screens: {
					sm: '640px',
					md: '768px',
					lg: '1024px',
					xl: '1280px',
					'2xl': '1536px',
				},
			},
			
			// Enhanced z-index system
			zIndex: {
				'0': '0',
				'10': '10',
				'20': '20',
				'30': '30',
				'40': '40',
				'50': '50',
				'auto': 'auto',
				'dropdown': '1000',
				'sticky': '1020',
				'banner': '1030',
				'overlay': '1040',
				'modal': '1050',
				'popover': '1060',
				'tooltip': '1070',
				'toast': '1080',
			},
		},
	},
	plugins: [],
}
