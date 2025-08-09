import React, { useState } from 'react';
import useGetAllAdmins from '../hooks/useGetAllAdmins';
import { Trash2, PlusCircle, EyeIcon, EyeOffIcon, XCircle, UserIcon } from 'lucide-react';
import useDeleteAdmin from '../hooks/useDeleteAdmin';
import useSignUp from '../hooks/useSignUp';

const AllAdmins = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Admin", // ensure role is Admin
  });

  const { data: admins, isLoading, isError, error } = useGetAllAdmins();
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();
  const { signupMutation, isPending: isSigningUp, error: signupError } = useSignUp();

  const handleDelete = (adminId) => {
    if (confirm("Are you sure you want to delete this admin?")) {
      deleteAdmin(adminId);
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData, {
      onSuccess: () => {
        setShowForm(false); // hide form after success
        setSignupData({ fullName: "", email: "", password: "", role: "Admin" });
      },
    });
  };



  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">All Admins</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-sm btn-primary flex items-center gap-2"
        >
          {showForm ? <XCircle size={18} /> : <PlusCircle size={18} />}
          {showForm ? "Cancel" : "Add Admin"}
        </button>
      </div>

      {/* Add Admin Form */}
      {showForm && (
        <div className="bg-base-100 border border-base-300 p-6 rounded-xl mb-6 shadow-md">
          {signupError && (
            <div className='alert alert-error mb-4'>
              <span>{signupError.response?.data?.message || "Something went wrong."}</span>
            </div>
          )}
          <form onSubmit={handleSignup} className="space-y-4 max-w-xl">
            <div>
              <label className='label'>
                <span className='label-text'>Full Name</span>
              </label>
              <input
                type="text"
                placeholder='Ramveer Meena'
                className='input input-bordered w-full'
                value={signupData.fullName}
                onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                required
              />
            </div>

            <div>
              <label className='label'>
                <span className='label-text'>Email</span>
              </label>
              <input
                type="email"
                placeholder='example@gmail.com'
                className='input input-bordered w-full'
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className='label'>
                <span className='label-text'>Password</span>
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder='********'
                  className='input input-bordered w-full pr-10'
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 z-10"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span> Creating...
                </>
              ) : (
                "Create Admin"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Admins List */}
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-[50vh]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : isError ? (
        <p className="text-center mt-10 text-red-500">Error: {error.message}</p>
      ) : (
        <div className="grid gap-4">
          {admins?.map((admin) => (
            <div
              key={admin._id}
              className="bg-base-200 border border-base-300 rounded-xl shadow-md flex items-center justify-between p-4 flex-wrap"
            >
              <div className="flex items-center gap-4 flex-1 min-w-[250px]">
                {/* <img
                  src={admin.profilePic || "/i.png"}
                  alt="Profile"
                  className="w-14 h-14 rounded-full border"
                /> */}
                <UserIcon className='h-20 w-20 bg-slate-500 mt-1 rounded-full'/>
                <div>
                  <p className="font-semibold text-base">{admin.fullName}</p>
                  <p className="text-sm text-base-content/70">{admin.email}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-sm text-base-content/60 min-w-[200px]">
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(admin.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Updated:</strong>{" "}
                  {new Date(admin.updatedAt).toLocaleString()}
                </p>
              </div>

              <div className="min-w-[100px] text-right mt-4 lg:mt-0">
                <button
                  onClick={() => handleDelete(admin._id)}
                  className="btn btn-sm btn-error text-white"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllAdmins;
