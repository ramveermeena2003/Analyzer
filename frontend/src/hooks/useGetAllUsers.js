import { useQuery } from "@tanstack/react-query"
import { getUsers } from "../lib/api";

const useGetAllUsers = () =>{
    return useQuery({
        queryKey : ["all-users"],
        queryFn : getUsers,
    })
};

export default useGetAllUsers;