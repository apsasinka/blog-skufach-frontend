import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import { selectIsAuth } from '../../redux/slices/auth';
import lightThemeStyles from './theme/lightTheme.module.scss';
import darkThemeStyles from './theme/darkTheme.module.scss';
import pinkThemeStyles from './theme/pinkTheme.module.scss';
import greenThemeStyles from './theme/greenTheme.module.scss';
import axios from '../../axios';

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setimageUrl] = React.useState('');
  const inputFileRef = React.useRef(null);

  const isEditing = Boolean(id);

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

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      console.log(file);
      const { data } = await axios.post('/upload', formData);
      setimageUrl(data.url);
    } catch (err) {
      alert('Ошибка при загрузке файла!')
      console.log(err);
    }
  };

  const onClickRemoveImage = () => {
    setimageUrl('');
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text,
      }
      const { data } = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании статьи файла!');
    }
  }

  React.useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(res => {
        const data = res.data;
        setTitle(data.title);
        setText(data.text);
        setimageUrl(data.imageUrl);
        setTags(data.tags.join(", "));
      }).catch(err => {
        console.warn(err);
        alert('Ошибка при загрузке статьи!');
      })
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  const selectedThemeStyles = themeStyles[currentTheme];

  return (
    <Paper className={selectedThemeStyles?.root || ''}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={selectedThemeStyles?.image || ''} src={`${process.env.REACT_APP_API}${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        className={selectedThemeStyles?.title || ''}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className={selectedThemeStyles?.tags || ''}
        variant="standard"
        placeholder="Тэги"
        fullWidth
      />
      <SimpleMDE className={selectedThemeStyles?.editor || ''} value={text} onChange={onChange} options={options} />
      <div className={selectedThemeStyles?.buttons || ''}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {!isEditing ? 'Опубликовать' : 'Сохранить'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
