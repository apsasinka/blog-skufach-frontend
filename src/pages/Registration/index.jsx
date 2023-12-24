import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import lightThemeStyles from '../theme/lightTheme.module.scss';
import darkThemeStyles from '../theme/darkTheme.module.scss';
import pinkThemeStyles from '../theme/pinkTheme.module.scss';
import greenThemeStyles from '../theme/greenTheme.module.scss';

import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';

export const Registration = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [currentTheme, setCurrentTheme] = useState('light');
  const [themeLoaded, setThemeLoaded] = useState(false);
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      avatarUrl: '',
      fullName: 'Nella PussyWorm',
      email: 'lina@key.ku',
      password: '123',
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
      const selectedThemeStyles = themeStyles[theme];
      setThemeLoaded(true);
    } catch (error) {
      console.error('Ошибка при загрузке стилей темы:', error);
    }
  };

  const onSubmit = async (values) => {
    const dataToSend = {
      avatarUrl, // Используем avatarUrl, полученный после загрузки аватара
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    };
  
    try {
      const data = await dispatch(fetchRegister(dataToSend));

      console.log(dataToSend);
  
      if (!data.payload) {
        return alert('Не удалось зарегистрироваться');
      }
  
      if ('token' in data.payload) {
        window.localStorage.setItem('token', data.payload.token);
      } else {
        alert('Не удалось зарегистрироваться');
      }
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      alert('Произошла ошибка при регистрации');
    }
  };
  
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
  
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
  
      const response = await axios.post('/upload', formData);
      const { data } = response;
  
      setAvatarUrl(data.url);
    } catch (error) {
      console.error('Ошибка при загрузке аватара:', error);
      alert('Ошибка при загрузке файла!');
    }
  };

  if (isAuth) {
    return <Navigate to="/" />
  }

  const selectedThemeStyles = themeStyles[currentTheme];

  return (
    <Paper className={selectedThemeStyles?.root || ''}>
      <Typography className={selectedThemeStyles?.title || ''} variant="h5">
        Создание аккаунта
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={selectedThemeStyles?.avatar || ''}>
          {avatarUrl ? (
            <Avatar
              sx={{ width: 100, height: 100 }}
              src={avatarUrl}
            />
          ) : (
            <Avatar sx={{ width: 100, height: 100 }} />
          )}
          <input
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <TextField
          className={selectedThemeStyles?.field || ''}
          label="Полное имя"
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Укажите имя' })}
          fullWidth
        />
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
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type="password"
          {...register('password', { required: 'Укажите пароль' })}
          fullWidth
        />
        <Button className={selectedThemeStyles?.button || ''} disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};