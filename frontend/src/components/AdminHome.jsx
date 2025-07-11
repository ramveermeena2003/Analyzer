import React from 'react';
import useGetAllUsers from '../hooks/useGetAllUsers';
import { BarChart3, Link, ShieldCheck, UploadCloud, Users } from 'lucide-react';
import useGetAllAdmins from '../hooks/useGetAllAdmins';

const AdminHome = () => {

  const { data: users, isLoading, isError, error } = useGetAllUsers();

  const {data: admins} = useGetAllAdmins();

  if (isLoading) return (
    <div className='flex justify-center items-center w-full h-[90vh]'>
        <span className='loading loading-spinner loading-lg'></span>
    </div>
  )
  if (isError) return <p className="text-center mt-10 text-red-500">Error: {error.message}</p>;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-10">
      <h2 className="text-2xl font-semibold mb-8 text-center">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {/* Total Admins */}
        <div className="bg-base-200 p-6 rounded-xl shadow-md border border-base-300 flex items-center gap-4 hover:shadow-lg transition">
          <div className="p-3 bg-primary text-white rounded-full">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-base-content">Total Admins</h3>
            <p className="text-2xl font-bold text-base-content">{admins?.length || 0}</p>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-base-200 p-6 rounded-xl shadow-md border border-base-300 flex items-center gap-4 hover:shadow-lg transition">
          <div className="p-3 bg-primary text-white rounded-full">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-base-content">Total Users</h3>
            <p className="text-2xl font-bold text-base-content">{users?.length || 0}</p>
          </div>
        </div>

        {/* Total Uploads */}
        <div className="bg-base-200 p-6 rounded-xl shadow-md border border-base-300 flex items-center gap-4 hover:shadow-lg transition">
          <div className="p-3 bg-secondary text-white rounded-full">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-base-content">Total Uploads</h3>
            <p className="text-2xl font-bold text-base-content">Todo...</p>
          </div>
        </div>

        {/* Most Used Chart */}
        <div className="bg-base-200 p-6 rounded-xl shadow-md border border-base-300 flex items-center gap-4 hover:shadow-lg transition">
          <div className="p-3 bg-accent text-white rounded-full">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-base-content">Most Used Chart</h3>
            <p className="text-2xl font-bold text-base-content">Todo...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
