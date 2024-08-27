import React, { useState, useEffect } from "react";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import { theme, getBodyStyles, fetchCurrentTheme } from "./theme";
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById("root"));

const AppContainer = () => {
  const [themeValue, setThemeValue] = useState('light');

  useEffect(() => {
    fetchCurrentTheme(setThemeValue);
  }, []);

  

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
