import { createMuiTheme, responsiveFontSizes } from '@material-ui/core'
import { Shadows } from '@material-ui/core/styles/shadows'

// Theme colors.
export const LightRed = '#ff9ea7'
export const BrightRed = '#de354c'
export const DeepRed = '#932432'

export const LightPurple = '#9d70d5'
export const PurePurple = '#6c43a3'
export const DeepPurple = '#3e2874'

// Text colors.
export const PurpleTingedGrey = '#283747'
export const Cloud = '#F3F3F3'

const defaultTheme = createMuiTheme()

const theme = responsiveFontSizes(
  createMuiTheme({
    breakpoints: {
      values: {
        ...defaultTheme.breakpoints.values,
        lg: 1440,
      },
    },
    palette: {
      background: {
        default: '#FFFFFF',
      },
      primary: {
        light: LightRed,
        main: BrightRed,
        dark: DeepRed,
        contrastText: Cloud,
      },
      secondary: {
        light: LightPurple,
        main: PurePurple,
        dark: DeepPurple,
        contrastText: Cloud,
      },
      text: {
        primary: PurpleTingedGrey,
        secondary: Cloud,
      },
    },
    typography: {
      fontFamily: "'Lato', sans-serif",
      h1: {
        fontSize: '6.25rem',
        fontWeight: 600,
        lineHeight: 1.267,
      },
      h2: {
        fontSize: '4.375rem',
        fontWeight: 600,
        lineHeight: 1.267,
      },
      h3: {
        fontSize: '2.25rem',
        fontWeight: 600,
        lineHeight: 1.321,
      },
      h4: {
        fontSize: '1.875rem',
        fontWeight: 600,
        lineHeight: 1.364,
      },
      h5: {
        fontSize: '1.725rem',
        fontWeight: 600,
        lineHeight: 1.389,
      },
      h6: {
        fontSize: '1.5rem',
        fontWeight: 500,
        lineHeight: 1.3125,
      },
      subtitle1: {
        fontSize: '1.25rem',
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5625,
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.429,
      },
      caption: {
        fontSize: '0.8125rem',
        lineHeight: 1.308,
      },
      button: {
        textTransform: 'none',
      },
    },
    overrides: {
      MuiButton: {
        root: {
          borderRadius: 42,
          textTransform: 'none',
        },
        contained: {
          minHeight: 35,
          minWidth: 85,
        },
        containedPrimary: {
          backgroundColor: BrightRed,
          '&:hover': {
            backgroundColor: DeepRed,
          },
        },
        containedSizeLarge: {
          fontSize: '1.5rem',
          fontWeight: 600,
          minHeight: 42,
          minWidth: 95,
        },
        textSizeLarge: {
          fontSize: '1.5rem',
          fontWeight: 500,
          minHeight: 42,
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
        },
      },
      MuiToolbar: {
        gutters: {
          [defaultTheme.breakpoints.up('sm')]: {
            paddingLeft: 0,
            paddingRight: 0,
          },
        },
      },
    },
    shadows: Array(25).fill('none') as Shadows,
  })
)

export default theme
