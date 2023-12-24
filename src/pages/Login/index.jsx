import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";

import lightThemeStyles from '../theme/lightTheme.module.scss';
import darkThemeStyles from '../theme/darkTheme.module.scss';
import pinkThemeStyles from '../theme/pinkTheme.module.scss';
import greenThemeStyles from '../theme/greenTheme.module.scss';

import { fetchAuth, selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';

export const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const [currentTheme, setCurrentTheme] = useState('light');
  const [themeLoaded, setThemeLoaded] = useState(false);
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: 'text@test.com',
      password: '1234',
    },
    mode: 'onChange',
  });

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

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));

    if (!data.payload) {
      return alert('Не удалось авторизоваться');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    } else {
      alert('Не удалось авторизоваться');
    }
  }

  if (isAuth) {
    return <Navigate to="/" />
  }

  const selectedThemeStyles = themeStyles[currentTheme];

  return (
    <Paper className={selectedThemeStyles?.root || ''}>
      <Typography className={selectedThemeStyles?.title || ''} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={selectedThemeStyles?.field || ''}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register('email', { required: 'Укажите почту' })}
          fullWidth
        />
        <TextField
          className={selectedThemeStyles?.field || ''}
          type="password"
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Укажите пароль' })}
          fullWidth
        />
        <Button className={selectedThemeStyles?.button || ''} disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
