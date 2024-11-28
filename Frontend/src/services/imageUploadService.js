import axios from "axios";
import { response } from "express";



export const uploadImage = async (image, setToast) => {
    if (!image) {
        console.log("image field is undefined")
        setToast({
            message: "Image field is undefined",
            type: "warning",
            showToast: true,
        });
        return { success: false };
    }

    if (image.type !== "image/jpeg" && "image/png") {
        setToast({
            message: "Please select a JPEG or PNG image!",
            type: "warning",
            showToast: true,
        });
        return { success: false };
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "kp8lpzkm");
    // formData.append("cloud_name", "druouih3d");
    console.log("FormData ", formData);
    try {
        await axios.post(
            "https://api.cloudinary.com/v1_1/:druouih3d/:image/upload",
            formData);
        setToast({
            message: "Image uploaded successfully!",
            type: "success",
            showToast: true,
        });
        return { success: true, url: response.data.url };

    } catch (error) {
        console.error("Cloudinary error: ", error);
        setToast({
            message: "Image upload failed. Please try again.",
            type: "error",
            showToast: true,
        });
        return { success: false };
    }
}



