import useAuthUser from '../hooks/useAuthUser'
import { Link, useLocation } from 'react-router';
import {HomeIcon,Users,UserIcon, Briefcase, ShieldCheck} from 'lucide-react';

const AdminSidebar = () => {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const currentPath = location.pathname;


    return (
        <aside className='w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-[91.5vh] sticky top-0'>
            <nav className='flex-1 p-4 space-y-1'>
                <Link to="/admin-dashboard" className={`btn btn-ghost justify-start w-full mt-8 gap-3 normal-case ${currentPath === "/admin-dashboard" ? "btn-active" : ""}`}>
                    <HomeIcon className='size-5 text-base-content opacity-70' />
                    <span>Home</span>
                </Link>

                <Link to="/all-users" className={`btn btn-ghost justify-start w-full gap-3 normal-case ${currentPath === "/all-users" ? "btn-active" : ""}`}>
                    <Users className='size-5 text-base-content opacity-70' />
                    <span>Users</span>
                </Link>
                <Link to="/all-admins" className={`btn btn-ghost justify-start w-full gap-3 normal-case ${currentPath === "/all-admins" ? "btn-active" : ""}`}>
                    <ShieldCheck className='size-5 text-base-content opacity-70' />
                    <span>Admins</span>
                </Link>
            </nav>

            {/* USER PROFILE SECTION */}
            <div className='p-4 border-t border-base-300 mt-auto'>
                <div className='flex items-center gap-3'>
                    <div className='avatar w-6 h-6 '>
                        {
                            authUser && authUser.profilePic !== "" ? (
                                <img src={authUser.profilePic} alt="Profile" />
                            ) :
                                (
                                    <UserIcon className='size-5' />
                                )
                        }

                    </div>
                    <div className="flex-1">
                        <p className='font-semibold text-sm'>{authUser?.fullName}</p>
                        <p className='text-xs text-success flex items-center gap-1'>
                            <span className='size-2 rounded-full bg-success inline-block'></span>
                            Online
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default AdminSidebar