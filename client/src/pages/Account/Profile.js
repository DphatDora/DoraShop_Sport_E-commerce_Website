import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/home/Header/Header";
import Footer from "../../components/home/Footer/Footer";
import FooterBottom from "../../components/home/Footer/FooterBottom";

const API_HOST = process.env.REACT_APP_API_HOST;

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_HOST}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        if (response.data.avatar) {
          setPreviewUrl(`${API_HOST}${response.data.avatar}`);
        }
        else{
          setPreviewUrl("/user.png");
        }
      } catch (err) {
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });

        if (err.response?.status === 401) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          localStorage.removeItem("token");
          navigate("/signin");
        } else {
          setError("Không thể tải thông tin người dùng. Vui lòng thử lại sau");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Thêm các trường thông tin vào formData
      Object.keys(userData).forEach((key) => {
        if (key !== "avatar") {
          formData.append(key, userData[key]);
        }
      });

      // Nếu có file ảnh mới, thêm vào formData
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const response = await axios.put(`${API_HOST}/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUserData(response.data);
      if (response.data.avatar) {
        setPreviewUrl(`${API_HOST}${response.data.avatar}`);
      }
      setIsEditing(false);
      setSuccessMessage("Cập nhật thông tin thành công!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Cập nhật thông tin thất bại. Vui lòng thử lại sau");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primeColor"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Thông tin cá nhân
              </h1>
              <div className="flex gap-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleUpdateProfile}
                      className="px-4 py-2 bg-primeColor text-white rounded-md hover:bg-black transition-colors"
                    >
                      Lưu thay đổi
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-primeColor text-white rounded-md hover:bg-black transition-colors"
                  >
                    Chỉnh sửa thông tin
                  </button>
                )}
              </div>
            </div>

            {successMessage && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="relative w-48 h-48 mb-4">
                  {isEditing ? (
                    <>
                      <img
                        src={previewUrl || "/default-avatar.png"}
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover border-4 border-primeColor"
                      />
                      <label className="absolute bottom-0 right-0 bg-primeColor text-white p-2 rounded-full cursor-pointer hover:bg-black transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </label>
                    </>
                  ) : (
                    <img
                      src={previewUrl || "/default-avatar.png"}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover border-4 border-primeColor"
                    />
                  )}
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {userData.username}
                </p>
                <p className="text-sm font-medium text-gray-700">
                  Tham gia ngày:{" "}
                  {userData.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Không xác định"}
                </p>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-lg text-gray-900">{userData.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên người dùng
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={userData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primeColor"
                    />
                  ) : (
                    <p className="text-lg text-gray-900">
                      {userData.username || "Chưa cập nhật"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primeColor"
                    />
                  ) : (
                    <p className="text-lg text-gray-900">
                      {userData.phone || "Chưa cập nhật"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primeColor"
                    />
                  ) : (
                    <p className="text-lg text-gray-900">
                      {userData.address || "Chưa cập nhật"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <FooterBottom />
    </div>
  );
};

export default Profile;
