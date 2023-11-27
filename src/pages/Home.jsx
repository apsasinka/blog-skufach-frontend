import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags, fetchPostsPopulare, fetchLastThreeComments } from '../redux/slices/posts';

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags, comments } = useSelector(state => state.posts);
  console.log(comments);
  const userData = useSelector(state => state.auth.data);
  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const [currentTab, setCurrentTab] = React.useState(0);
  const isCommentsLoading = comments.status === 'loading';

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    if (newValue === 0) {
      dispatch(fetchPosts());
    } else if (newValue === 1) {
      dispatch(fetchPostsPopulare());
    }
  };

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchLastThreeComments());
  }, [dispatch]);

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={currentTab}
        onChange={handleTabChange}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `http://89.104.67.44:4444${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={obj.createdAt}
                commentsCount={obj.commentsCount}
                viewsCount={obj.viewsCount}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
                isCurrentUserAdmin={userData && userData.isAdmin}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={comments.items.data} // Отображение первых трех комментариев из Redux-стейта
            isLoading={isCommentsLoading} // Установите isLoading в зависимости от статуса загрузки комментариев
          />
        </Grid>
      </Grid>
    </>
  );
};
