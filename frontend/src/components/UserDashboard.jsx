import React, { useState } from 'react'
import useLogout from '../hooks/useLogout'
import { LogOutIcon } from "lucide-react"
import Navbar from './UserNavbar.jsx';
import UserSidebar from './UserSidebar.jsx';
import UserHome from './UserHome.jsx';


const UserDashboard = () => {
  const { logoutMutation, isPending, error } = useLogout();

  return (
    <div>
      <div>
        <Navbar/>
      </div>
      <div className='flex gap-10'>
        <UserSidebar/>
        <UserHome/>
      </div>
    </div>
  )
}

export default UserDashboard
