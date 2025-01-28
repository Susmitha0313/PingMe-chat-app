import React, { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../Utility/cropImage";
import axios from "axios";

const ProfileModal = ({ modal, setModal, user, url }) => {
  const [profilePic, setProfilePic] = useState("/default-profile-pic.jpg");
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Set the Base64 string as the profile picture
      setShowCropModal(true);
    }
  };

  const handleCropComplete = (_, croppedArea) => {
    setCroppedArea(croppedArea);
  };

  const uploadToCloudinary = async (croppedImgBlob) => {
    try {
      const imgData = new FormData();
      imgData.append("file", croppedImgBlob);
      imgData.append("upload_preset", "pingme");
      imgData.append("cloud_name", "druouih3d");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/druouih3d/image/upload",
        {
          method: "POST",
          body: imgData,
        }
      );
      if (!res.ok) throw new Error("Failed to upload to Cloudinary.");
      const { url } = await res.json();
      if (!url) throw new Error("Cloudinary did not return a URL.");
      return url;
    } catch (err) {
      throw err;
    }
  };
     
  const handleCropSave = async () => {
    try {
      setLoading(true);
      const croppedImage = await getCroppedImg(image, croppedArea);
      const uploadUrl = await uploadToCloudinary(croppedImage);
      console.log(uploadUrl);
      const res = await axios.patch(
        `${url}/api/users/${user._id}/upload-profile-pic`,
        { picture: uploadUrl },
        {
          headers: {   
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setProfilePic(res.data.user.picture); // Access the `user` object returned by the backend
      setShowCropModal(false);
    } catch (error) {
      console.error(error);
      setErrorMessage("Error cropping or uploading the image.");
    } finally {
      setLoading(false);
    }
  };


  if (!modal) return null;

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
        <div className="relative w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                User Profile
              </h3>
              <button
                onClick={() => {
                  setModal(false);
                }}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="small-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-5 flex flex-col items-center space-y-4">
              <div className=" relative max-w-sm bg-white border border-gray-200 rounded-full shadow dark:bg-gray-500 dark:border-gray-700">
                <a href="#">
                  <img
                    className="rounded-full "
                    src={profilePic}
                    alt="Profile"
                  />
                </a>
                <button
                  onClick={handleButtonClick}
                  type="button"
                  className=" absolute bottom-4 right-9 translate-x-1/4 text-blue-700 bg-gray-600 border border-gray-700 hover:bg-blue-700 hover:text-white focus:ring-2 focus:outline-none focus:ring-blue-500 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-gray-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-600 dark:hover:bg-blue-500"
                >
                  <svg
                    className="w-9 h-9 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 18"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 12.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                    />
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 3h-2l-.447-.894A2 2 0 0 0 12.764 1H7.236a2 2 0 0 0-1.789 1.106L5 3H3a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a2 2 0 0 0-2-2Z"
                    />
                  </svg>
                  <span className="sr-only">Upload Profile Picture</span>
                </button>
              </div>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}

              <p className="text-base leading-relaxed text-grey-500 dark:text-white">
                User: {user.name}
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-white">
                Email: {user.email}
              </p>
            </div>

            {/* Crop Modal */}
            {showCropModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-md w-full max-w-md flex flex-col items-center">
                  <div className="w-full h-64 relative">
                    <Cropper
                      image={image}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={handleCropComplete}
                    />
                  </div>
                  <div className="flex justify-end space-x-4 mt-4 w-full">
                    <button
                      className="px-4 py-2 bg-gray-300 text-black dark:bg-gray-700 dark:text-white rounded-md"
                      onClick={() => setShowCropModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md"
                      onClick={async () => {
                        await handleCropSave();
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  data-modal-hide="small-modal"
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  I accept
                </button>
              <button
                onClick={()=>{setModal(false)}}
                  data-modal-hide="small-modal"
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Close
                </button>
              </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
