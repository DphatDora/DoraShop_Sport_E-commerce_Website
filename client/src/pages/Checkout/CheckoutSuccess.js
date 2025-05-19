import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Header from "../../components/home/Header/Header";
import Footer from "../../components/home/Footer/Footer";
import FooterBottom from "../../components/home/Footer/FooterBottom";

const CheckoutSuccess = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleViewOrders = () => {
    navigate("/orders");
  };

  return (
    <div className="w-full bg-gray-50">
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7F7] px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <CheckCircle className="mx-auto text-green-500" size={64} />
          <h2 className="text-2xl font-bold mt-4 text-gray-800">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mt-2">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleGoHome}
              className="px-6 py-2 bg-primeColor text-white rounded-md hover:bg-black transition duration-300"
            >
              Go to Home
            </button>
            <button
              onClick={handleViewOrders}
              className="px-6 py-2 border border-primeColor text-primeColor rounded-md hover:bg-primeColor hover:text-white transition duration-300"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <FooterBottom />
    </div>
  );
};

export default CheckoutSuccess;
