import React from 'react';
import useAuthUser from './hooks/useAuthUser.js';
import PageLoader from './components/PageLoader.jsx';
import { Routes, Route } from 'react-router-dom'; // ✅ Corrected import
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { ToastContainer } from 'react-toastify';
import HomePage from './components/HomePage.jsx';

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);

  if (isLoading) return <PageLoader />;

  return (
    <div className='h-screen'>
      <Routes>
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/' element={<HomePage/>}/>
      </Routes>

      <ToastContainer/>
    </div>
  );
};

export default App;
