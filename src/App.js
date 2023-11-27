import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from 'react-redux';

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/posts/:id" element={ <FullPost />} />
          <Route path="/posts/:id/edit" element={ <AddPost />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add_post" element={<AddPost />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
