import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import lightThemeStyles from './theme/lightTheme.module.scss';
import darkThemeStyles from './theme/darkTheme.module.scss';
import pinkThemeStyles from './theme/pinkTheme.module.scss';
import greenThemeStyles from './theme/greenTheme.module.scss';
import axios from '../../axios';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { selectIsAuth, logout } from '../../redux/slices/auth';

export const Header = () => {
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

  const dispatch = useDispatch();

  const isAuth = useSelector(selectIsAuth);

  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  const selectedThemeStyles = themeStyles[currentTheme];

  return (
    <div className={selectedThemeStyles.root}>
      <Container maxWidth="lg">
        <div className={selectedThemeStyles.inner}>
          <Link className={selectedThemeStyles.logo} to="/">
            <div>skufach</div>
          </Link>
          <div className={selectedThemeStyles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add_post">
                  <Button className={selectedThemeStyles?.buttonPost || ''} variant="contained">Написать статью</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button className={selectedThemeStyles?.buttonOut || ''} variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button className={selectedThemeStyles?.button || ''} variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
