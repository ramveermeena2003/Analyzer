import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const uploadExcelFile = async (file) => {
  const formData = new FormData();
  formData.append("excelFile", file); // This key should match your backend multer field

  const res = await axiosInstance.post("/excel/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export default function useUploadExcel() {
  return useMutation({ mutationFn: uploadExcelFile });
}
