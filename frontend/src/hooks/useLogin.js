import {useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { login } from '../lib/api';
import { toast } from 'react-toastify';

const useLogin = () => {
  const queryClient = useQueryClient();

  const {mutate, isPending, error}  = useMutation({
    mutationFn: login,
    onSuccess :() =>{
        toast.success("Successfully Logged In !");
        queryClient.invalidateQueries({queryKey : ["authUser"]});
    },
    onError(error)
    {
        toast.error(error.response.data.message);
    }
  });

  return {loginMutation : mutate, isPending, error};

}

export default useLogin
