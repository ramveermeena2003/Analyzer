import React, { useState } from 'react'
import useLogout from '../hooks/useLogout'
import { LogOutIcon } from "lucide-react"
import Navbar from './UserNavbar.jsx';
import UserSidebar from './UserSidebar.jsx';
import UserHome from './UserHome.jsx';
import UserNavbar from './UserNavbar.jsx';
import { useLocation } from 'react-router';
import UserHistory from "./UserHistory.jsx"


const UserDashboard = () => {
  const { logoutMutation, isPending, error } = useLogout();
  const location = useLocation();
  const currLocation = location.pathname;

  return (
    <div>
      <div>
        <UserNavbar/>
      </div>
      <div className='flex gap-10'>
        <UserSidebar/>
        {currLocation === "/user-dashboard" ? <UserHome/> : currLocation === "/user-history" ? <UserHistory/> : <UserHome/>}
      </div>
    </div>
  )
}

export default UserDashboard
