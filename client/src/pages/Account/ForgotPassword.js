import React, { useState } from "react";
import axios from "axios";

const API_HOST = process.env.REACT_APP_API_HOST;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post(`${API_HOST}/forgot-password`, { email });
      setMessage("Vui lòng kiểm tra email để nhận link đặt lại mật khẩu.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau."
      );
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Quên mật khẩu</h2>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-primeColor text-white py-2 rounded hover:bg-black"
        >
          Gửi link đặt lại mật khẩu
        </button>
        {message && <p className="text-green-600 mt-4">{message}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
