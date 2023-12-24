import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import lightThemeStyles from './theme/lightTheme.module.scss';
import darkThemeStyles from './theme/darkTheme.module.scss';
import pinkThemeStyles from './theme/pinkTheme.module.scss';
import greenThemeStyles from './theme/greenTheme.module.scss';
import axios from '../../axios';

export const SideBlock = ({ title, children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [themeLoaded, setThemeLoaded] = useState(false);

  const themeStyles = {
    light: lightThemeStyles,
    dark: darkThemeStyles,
    pink: pinkThemeStyles,
    green: greenThemeStyles,
  };

  useEffect(() => {
    const fetchCurrentTheme = async () => {
      try {
        const response = await axios.get('/gettheme');

        if (response.status === 200) {
          const { currentTheme } = response.data;
          setCurrentTheme(currentTheme);
          applyThemeStyles(currentTheme);
        } else {
          console.error('Ошибка при получении текущей темы');
        }
      } catch (error) {
        console.error('Ошибка при получении текущей темы:', error);
      }
    };

    fetchCurrentTheme();
  }, []);

  const applyThemeStyles = (theme) => {
    try {
      setThemeLoaded(true);
    } catch (error) {
      console.error('Ошибка при загрузке стилей темы:', error);
    }
  };

  const selectedThemeStyles = themeStyles[currentTheme];

  return (
    <Paper className={selectedThemeStyles?.root || ''}>
      <Typography variant="h6" cclassName={selectedThemeStyles?.title || ''}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};
