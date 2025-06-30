import { axiosInstance } from "./axios";

export const signup = async (signupData) =>{
    const response = await axiosInstance.post("/auth/signup",signupData);
    return response.data;
};

export const login = async (loginData) => {
    const response = await axiosInstance.post("/auth/login",loginData);
    return response.data;
}

export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
}

export const getAuthUser = async () =>{
    try {
        const res = await axiosInstance.get("/auth/me");
        if(res.data.admin) return res.data.admin
        else return res.data.user;

    } catch (error) {
        console.log("Error in getAuthUser : ",error);
        return null;
    }
};

export const getUsers = async () =>{
    try {
        const res = await axiosInstance.get("/auth/all-users");
        return res.data;
    } catch (error) {
        return res.status(500).json({message : "Error while fetching users",error});
    }
}

export const getAdmins = async () =>{
    try {
        const res = await axiosInstance.get("/auth/all-admins");
        return res.data;
    } catch (error) {
        return res.status(500).json({message : "Error while fetching users",error});
    }
}

export const deleteUser = async (userId) =>{
    const res = await axiosInstance.delete(`/auth/delete-user/${userId}`);

    return res.data;
};

export const deleteAdmin = async (adminId) => {
    const res = await axiosInstance.delete(`/auth/delete-admin/${adminId}`);

    return res.data;
}