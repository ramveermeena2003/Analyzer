import React, { useState } from 'react'
import AdminSidebar from './AdminSidebar.jsx';
import AdminNavbar from './AdminNavbar.jsx';
import AdminHome from './AdminHome.jsx';
import { useLocation } from 'react-router';
import AllUser from './AllUsers.jsx';
import AllAdmins from './AllAdmins.jsx';


const AdminDashBoard = () => {
  const location = useLocation();
  const currLocation = location.pathname;

  return (
    <div>
      <div>
        <AdminNavbar/>
      </div>
      <div className='flex gap-10'>
        <AdminSidebar/>
        {currLocation === "/admin-dashboard" ? <AdminHome/> : currLocation === "/all-users" ? <AllUser/> : <AllAdmins/>}
      </div>
    </div>
  )
}

export default AdminDashBoard
