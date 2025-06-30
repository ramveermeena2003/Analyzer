import React from 'react';
import useGetAllUsers from '../hooks/useGetAllUsers';
import useDeleteUser from '../hooks/useDeleteUser';
import { Trash2 } from 'lucide-react';

const AllUser = () => {
  const { data: users, isLoading, isError, error } = useGetAllUsers();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleDelete = (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(userId);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full h-[90vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (isError)
    return <p className="text-center mt-10 text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-6">All Users</h2>
      <div className="grid gap-4">
        {users?.map((user) => (
          <div
            key={user._id}
            className="bg-base-200 border border-base-300 rounded-xl shadow-md flex items-center justify-between p-4 flex-wrap"
          >
            {/* Profile & Info */}
            <div className="flex items-center gap-4 flex-1 min-w-[250px]">
              <img
                src={user.profilePic || "/i.png"}
                alt="Profile"
                className="w-14 h-14 rounded-full border"
              />
              <div>
                <p className="font-semibold text-base">{user.fullName}</p>
                <p className="text-sm text-base-content/70">{user.email}</p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="flex flex-col gap-1 text-sm text-base-content/60 min-w-[200px]">
              <p>
                <strong>Created:</strong>{" "}
                {new Date(user.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Updated:</strong>{" "}
                {new Date(user.updatedAt).toLocaleString()}
              </p>
            </div>

            {/* Delete Button */}
            <div className="min-w-[100px] text-right mt-4 lg:mt-0">
              <button
                onClick={() => handleDelete(user._id)}
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
    </div>
  );
};

export default AllUser;
