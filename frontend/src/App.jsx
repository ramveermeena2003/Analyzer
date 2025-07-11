import React from 'react';
import useAuthUser from './hooks/useAuthUser.js';
import PageLoader from './components/PageLoader.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { ToastContainer } from 'react-toastify';
import HomePage from './pages/HomePage.jsx';
import { CodeSquare } from 'lucide-react';
import UserDashboard from './components/UserDashboard.jsx';
import AdminDashBoard from './components/AdminDashBoard.jsx';
import { useThemeStore } from './store/useThemeStore.js';
import AllUser from './components/AllUsers.jsx';

const App = () => {
  const { theme } = useThemeStore();


  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);

  const role = authUser?.role;


  if (isLoading) return <PageLoader />;

  return (
    <div className='h-screen' data-theme={theme}>
      <Routes>
        <Route path='/' element={!isAuthenticated ? <HomePage /> : <Navigate to={role === "user" ? "/user-dashboard" : "/admin-dashboard"} />} />
        <Route path='/signup' element={!isAuthenticated ? <SignUpPage /> : <Navigate to={role === "user" ? "/user-dashboard" : "/admin-dashboard"} />} />
        <Route path='/login' element={!isAuthenticated ? <LoginPage /> : <Navigate to={role === "user" ? "/user-dashboard" : "/admin-dashboard"} />} />
        <Route path='/user-dashboard' element={isAuthenticated ? <UserDashboard /> : <Navigate to="/" />} />
        <Route path='/admin-dashboard' element={isAuthenticated ? <AdminDashBoard /> : <Navigate to="/" />} />
        <Route path='/all-users' element={isAuthenticated ? <AdminDashBoard /> : <Navigate to='/' />} />
        <Route path='/all-admins' element={isAuthenticated ? <AdminDashBoard /> : <Navigate to='/' />} />
        <Route path='/user-history' element={isAuthenticated ? <UserDashboard/> : <Navigate to='/' />} />
      </Routes>

      <ToastContainer />
    </div>
  );
};

export default App;
