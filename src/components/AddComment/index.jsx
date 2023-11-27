import React, { useState, useEffect } from "react";
import axios from "../../axios";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

export const Index = ({ postId, avatarUrl, setComments, userData }) => {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = () => {
    if (!userData) {
      console.error("Информация о пользователе отсутствует");
      return;
    }
  
    const newComment = {
      text: commentText,
      fullName: userData.fullName,
    };
  
    axios
      .post(`/posts/${postId}/comments`, newComment, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        console.log("Комментарий успешно отправлен", res.data);
        setCommentText("");
  
        // Запрос для получения обновленного списка комментариев после добавления нового комментария
        axios.get(`/posts/${postId}/comments`)
          .then((commentsRes) => {
            setComments(commentsRes.data);
          })
          .catch((err) => {
            console.error("Ошибка при получении списка комментариев", err);
          });
      })
      .catch((err) => {
        console.error("Ошибка при отправке комментария", err);
      });
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={avatarUrl}
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button variant="contained" onClick={handleCommentSubmit}>
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};

// Ваш компонент FullPost.jsx остается таким же как и прежде
