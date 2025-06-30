import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteUser } from "../lib/api";
import { toast } from "react-toastify";

const useDeleteUser = () =>{
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn : deleteUser,
        onSuccess: () =>{
            toast.success("User deleted successfully");
            queryClient.invalidateQueries(["all-users"]);
        },

        onError: (error) => {
            toast.error(`Failed to delete user : ${error.response?.data?.message || error.message}`);
        }
    })
};

export default useDeleteUser;