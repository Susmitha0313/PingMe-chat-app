import React, { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../Utility/cropImage";
import axios from "axios";


const ProfileModal = ({ modal, setModal, profile, setProfile, url }) => {
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

      const res = await axios.patch(
        `${url}/api/users/${profile._id}/upload-profile-pic`,
        { picture: uploadUrl },
        {
          headers: {   
            "Content-Type": "application/json",
            Authorization: `Bearer ${profile.token}`,
          },
        }
      );
      setProfile((prevProf)=> ({...prevProf, picture: uploadUrl})); // Access the `user` object returned by the backend     
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
                    src={profile.picture}
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
              <div>
                <p className="text-xl py-3 font-semibold text-gray-700 dark:text-white flex items-center gap-3">
                  {/* <HiUser className="text-gray-500 dark:text-gray-400 w-5 h-5" /> */}
                  <span class="material-symbols-outlined">person</span>
                  {profile.name}
                </p>
                <p className="text-md font-light text-gray-700 dark:text-white flex items-center gap-3">
                  <span class="material-symbols-outlined">email</span>
                  {profile.email}
                </p>
              </div>
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
                      {loading ? (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            className="inline w-6 h-6 text-gray-200 animate-spin dark:text-white fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
