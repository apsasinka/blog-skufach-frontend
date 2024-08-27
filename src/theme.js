import { createTheme } from "@mui/material/styles";
import axios from 'axios';

export const theme = createTheme({
  shadows: ["none"],
  palette: {
    primary: {
      main: "#4361ee",
    },
  },
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 400,
    },
  },
  secondary: {
    main: "#ff5722",
  },
});

export const getBodyStyles = (themeValue) => {
  switch (themeValue) {
    case 'light':
      return {
        backgroundColor: '#FFFFFF',
      };
    case 'dark':
      return {
        backgroundColor: '#111214',
      };
    case 'pink':
      return {
        backgroundColor: '#905274',
      };
    case 'green':
        return {
          backgroundColor: '#0B3A36',
        };
    default:
      return {
        backgroundColor: '#9b1919',
      };
  }
};

export const fetchCurrentTheme = async (setThemeValue) => {
  try {
    const response = await axios.get('/gettheme');

    if (response.status === 200) {
      const currentTheme = response.data.currentTheme;
      setThemeValue(currentTheme);
    } else {
      console.error('Ошибка при получении текущей темы');
    }
  } catch (error) {
    console.error('Ошибка при получении текущей темы:', error);
  }
};