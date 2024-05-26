import axios from "axios";

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "upload-multiple");
  const { data } = await axios.post(
    "https://api.cloudinary.com/v1_1/sliceofansh/image/upload",
    formData
  );
  return { url: data?.secure_url };
};
