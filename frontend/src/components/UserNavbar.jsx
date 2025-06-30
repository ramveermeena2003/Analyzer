import useAuthUser from '../hooks/useAuthUser'
import { Link, useLocation } from 'react-router';
import { ChartNoAxesCombined, History, HomeIcon, LogOutIcon, MenuIcon, MoonIcon, Settings, SunIcon, UserIcon } from 'lucide-react';
import useLogout from '../hooks/useLogout';
import { useThemeStore } from '../store/useThemeStore';

const Navbar = () => {

  const location = useLocation();
  const currentPath = location.pathname;

  const { theme, setTheme } = useThemeStore();

  const { authUser } = useAuthUser();

  const { logoutMutation, isPending, error } = useLogout();

  const handleTheme = (selectedTheme) => {
    setTheme(selectedTheme === "Dark" ? "dark" : "light");
  };

  return (
    <div className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center px-3'>
      <div className='flex items-center justify-between w-full'>
        <div className='pl-5 flex items-center justify-center'>

          {/* humburger button */}

          <div className="dropdown dropdown-start">
            <button tabIndex={0} className='mt-2.5 lg:hidden btn btn-ghost btn-circle'>
              <MenuIcon className='h-6 w-6' />
            </button>

            <div tabIndex={0} className='dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border border-base-content/10 h-[90vh] overflow-y-auto flex flex-col'>
            
            <div>

              <Link to="/user-dashboard" className={`btn btn-ghost justify-start w-full mt-8 gap-3 normal-case ${currentPath === "/user-dashboard" ? "btn-active" : ""}`}>
                <HomeIcon className='size-5 text-base-content opacity-70' />
                <span>Home</span>
              </Link>

              <Link to="/user-dashboard" className={`btn btn-ghost justify-start w-full gap-3 normal-case ${currentPath === "/user-history" ? "btn-active" : ""}`}>
                <History className='size-5 text-base-content opacity-70' />
                <span>History</span>
              </Link>
            </div>

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

            </div>
          </div>
          <Link to="/" className='flex items-center gap-2.5'>
            <ChartNoAxesCombined className='size-9 text-primary' />
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>Analyzr</span>
          </Link>
        </div>

        <div className='flex gap-5'>

          {/* profile */}

          <div className='dropdown dropdown-end'>
            {/* Dropdown trigger */}
            <button tabIndex={0} className='btn btn-ghost btn-circle'>
              {
                authUser && authUser.profilePic !== "" ? (
                  <img src={authUser.profilePic} alt="Profile" />
                ) :
                  (
                    <UserIcon className='size-5' />
                  )
              }
            </button>

            <div tabIndex={0} className='dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border border-base-content/10 max-h-80 overflow-y-auto'>
              {authUser && (
                <div className='flex flex-col w-full justify-center items-center mb-7'>
                  <img src={authUser.profilePic || "/i.png"} alt="Profile picture" className='w-20 h-20 rounded-full' />
                  <p>{authUser.fullName}</p>
                </div>
              )}

              <div>
                <button className='btn btn-ghost btn-circle'>
                  {theme === "dark" ? (
                    <MoonIcon className='h-6 w-6 text-base-content opacity-70' />
                  ) :
                    (
                      <SunIcon className='h-6 w-6 text-base-content opacity-70' />
                    )}
                </button>
                <span className='pr-2'>Appearance</span>
                <select onChange={(e) => handleTheme(e.target.value)}>
                  <option value="Dark" className='text-[10px] '>Dark</option>
                  <option value="Light" className='text-[10px] '>Light</option>
                </select>
              </div>

              <div>
                <button className='btn btn-ghost btn-circle'>
                  <Settings className='h-6 w-6 text-base-content opacity-70' />
                </button>
                <span className='hover:cursor-pointer'>Change Password</span>
              </div>

              <div onClick={logoutMutation}>
                <button className='btn btn-ghost btn-circle' >
                  <LogOutIcon className='h-6 w-6 text-base-content opacity-70' />
                </button>
                <span className='hover:cursor-pointer'>Log out</span>
              </div>
            </div>

          </div>

        </div>


      </div>
    </div>
  )
}

export default Navbar
