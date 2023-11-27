import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const { data } = await axios.get('/posts');
    return data;
});

export const fetchPostsPopulare = createAsyncThunk('posts/fetchPostsPopulare', async () => {
    const { data } = await axios.get('/posts/populare');
    return data;
});

export const fetchLastThreeComments = createAsyncThunk('posts/fetchLastThreeComments', async () => {
    try {
        const data = await axios.get('/comments'); 
        return data; 
    } catch (error) {
        console.error('Ошибка при получении последних комментариев', error);
        throw error;
    }
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const { data } = await axios.get('/tags');
    return data;
});

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
    const { data } = await axios.delete(`/posts/${id}`);
    return data;
});

const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    },
    comments: {
        items: [],
        status: 'loading',
    }
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducer: {},
    extraReducers: {
        [fetchPosts.pending]: (state) => {
            state.posts.items = [];
            state.posts.status = 'loading';
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = 'loaded';
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = 'failed';
        },
        [fetchPostsPopulare.pending]: (state) => {
            state.posts.items = [];
            state.posts.status = 'loading';
        },
        [fetchPostsPopulare.fulfilled]: (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = 'loaded';
        },
        [fetchPostsPopulare.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = 'failed';
        },
        [fetchTags.pending]: (state) => {
            state.tags.items = [];
            state.tags.status = 'loading';
        },
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = 'loaded';
        },
        [fetchTags.rejected]: (state) => {
            state.tags.items = [];
            state.tags.status = 'failed';
        },
        [fetchRemovePost.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg);
        },
        [fetchRemovePost.rejected]: (state) => {
            state.posts.status = 'failed';
        },
        [fetchLastThreeComments.pending]: (state) => {
            state.comments.items = [];
            state.comments.status = 'loading';
        },
        [fetchLastThreeComments.fulfilled]: (state, action) => {
            state.comments.items = action.payload;
            state.comments.status = 'loaded';
        },
        [fetchLastThreeComments.rejected]: (state) => {
            state.comments.items = [];
            state.comments.status = 'failed';
        },
    }
});

export const postsReducer = postsSlice.reducer;