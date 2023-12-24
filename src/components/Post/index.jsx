import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { useDispatch } from 'react-redux';
import axios from '../../axios';

import lightThemeStyles from './theme/lightTheme.module.scss';
import darkThemeStyles from './theme/darkTheme.module.scss';
import pinkThemeStyles from './theme/pinkTheme.module.scss';
import greenThemeStyles from './theme/greenTheme.module.scss';

import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { fetchRemovePost } from '../../redux/slices/posts';

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
  isCurrentUserAdmin,
}) => {
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
  if (isLoading) {
    return <PostSkeleton />;
  }

  const onClickRemove = () => {
    if (window.confirm('Вы действительно хотите удалить пост?')) {
      dispatch(fetchRemovePost(id));
    }
  };

  const showEditButtons = isEditable || isCurrentUserAdmin;

  const selectedThemeStyles = themeStyles[currentTheme];

  return (
    <div className={clsx(selectedThemeStyles.root, { [selectedThemeStyles.rootFull]: isFullPost })}>
      {showEditButtons && (
        <div className={selectedThemeStyles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(selectedThemeStyles.image, { [selectedThemeStyles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={selectedThemeStyles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={selectedThemeStyles.indention}>
          <h2 className={clsx(selectedThemeStyles.title, { [selectedThemeStyles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          <ul className={selectedThemeStyles.tags}>
            {tags.map((name) => (
              <li key={name}>
                <Link to={`/tag/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
          {children && <div className={selectedThemeStyles.content}>{children}</div>}
          <ul className={selectedThemeStyles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
