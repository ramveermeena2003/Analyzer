import { useMutation, useQueryClient } from "@tanstack/react-query"
import { signup } from "../lib/api";
import{toast} from "react-toastify"

const useSignUp = () => {

    const queryClient = useQueryClient();

    const {mutate, isPending, error} = useMutation({
        mutationFn : signup,
        onSuccess: () =>{
            toast.success("Successfully Sign Up !");
            queryClient.invalidateQueries({queryKey:["authUser"]});
            
        },
        onError: (error) =>{
            toast.error(error.response.data.message);
        }
    });

    return {signupMutation :mutate, isPending, error};
}

export default useSignUp;