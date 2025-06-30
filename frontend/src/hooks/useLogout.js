import React from 'react'
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {toast} from "react-toastify"
import { logout } from '../lib/api';


const useLogout = () => {
    const queryClient = useQueryClient();
    const {mutate : logoutMutation, isPending, error} = useMutation({
        mutationFn  : logout,
        onSuccess: () =>{
            toast.success("Successfully Logout!");
            queryClient.invalidateQueries({queryKey : ["authUser"]});
        },
        onError : () =>{
            toast.error(error.response.data.message);
        }
    });

    return {logoutMutation, isPending,error};
}

export default useLogout
