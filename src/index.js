import React, { useState, useEffect } from "react";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import store from './redux/store';
import axios from "./axios";

const root = ReactDOM.createRoot(document.getElementById("root"));

const AppContainer = () => {
  const [themeValue, setThemeValue] = useState('light');

  useEffect(() => {
    const fetchCurrentTheme = async () => {
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

    fetchCurrentTheme();
  }, []);

  const getBodyStyles = (themeValue) => {
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

  const bodyStyles = getBodyStyles(themeValue);

  useEffect(() => {
    Object.assign(document.body.style, bodyStyles);
  }, [themeValue]);

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};

root.render(<AppContainer />);
