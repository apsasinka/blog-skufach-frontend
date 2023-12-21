import React from "react";
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import axios from "../axios";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import ReactMarkdown from "react-markdown";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [comments, setComments] = React.useState([]);
  const userData = useSelector(state => state.auth.data);
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const postData = await axios.get(`/posts/${id}`);
      setData(postData.data);
      const commentsData = await axios.get(`/posts/${id}/comments`);
      setComments(commentsData.data);
      console.log(postData.data, commentsData.data);
      setLoading(false);
    } catch (error) {
      console.warn(error);
      alert('Ошибка при загрузке данных');
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(`/posts/${id}/comments/${commentId}`);
      const updatedComments = await axios.get(`/posts/${id}/comments`);
      setComments(updatedComments.data);
      console.log("Комментарий успешно удален");
    } catch (error) {
      console.error("Ошибка при удалении комментария", error);
    }
  };

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  const { _id, title, imageUrl, user, viewsCount, commentsCount, tags, text } = data;

  return (
    <>
      <Post
        id={_id}
        title={title}
        imageUrl={imageUrl ? `${process.env.REACT_APP_API}${imageUrl}` : ''}
        user={user ? { fullName: user.fullName, email: user.email, avatarUrl: user.avatarUrl } : null}
        createdAt={user ? user.createdAt : null}
        viewsCount={viewsCount}
        commentsCount={commentsCount}
        tags={tags}
        isFullPost
      >
        <ReactMarkdown children={text} />
      </Post>
      {!isLoading && (
        <CommentsBlock
          onDelete={handleCommentDelete} // handleCommentDelete получает commentId
          items={comments.map(comment => ({
            user: {
              id: comment.user._id,
              fullName: comment.user.fullName,
              avatarUrl: comment.user.avatarUrl,
            },
            text: comment.text,
            id: comment._id,
          }))}
          isLoading={false}
        >
          <Index
            postId={id}
            avatarUrl={comments.map(comment => ({
              avatarUrl: comment.user.avatarUrl,
            }))}
            setComments={setComments}
            userData={userData}
          />
        </CommentsBlock>
      )}
    </>
  );
};
