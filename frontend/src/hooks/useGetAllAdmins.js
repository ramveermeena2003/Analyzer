import { useQuery } from "@tanstack/react-query"
import { getAdmins } from "../lib/api"

const useGetAllAdmins = () =>{
    return useQuery({
        queryKey:  ["all-admins"],
        queryFn:  getAdmins,
    })
}

export default useGetAllAdmins;