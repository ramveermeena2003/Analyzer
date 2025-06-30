import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteAdmin} from "../lib/api";
import { toast } from "react-toastify";

const useDeleteAdmin = () =>{
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn : deleteAdmin,
        onSuccess: () =>{
            toast.success("Admin deleted successfully");
            queryClient.invalidateQueries(["all-admins"]);
        },

        onError: (error) => {
            toast.error(`Failed to delete admin : ${error.response?.data?.message || error.message}`);
        }
    })
};

export default useDeleteAdmin;