import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Header from "../../components/home/Header/Header";
import Footer from "../../components/home/Footer/Footer";
import FooterBottom from "../../components/home/Footer/FooterBottom";

const API_HOST = process.env.REACT_APP_API_HOST;

const Checkout = () => {
  const navigate = useNavigate();
  const products = useSelector((state) => state.orebiReducer.products);
  const [userData, setUserData] = useState({
    username: "",
    phone: "",
    email: "",
    address: "",
  });
  const [totalAmt, setTotalAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);

  // Fetch user data
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
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          navigate("/signin");
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // Calculate total amount
  useEffect(() => {
    let price = 0;
    products.forEach((item) => {
      price += item.price * item.quantity;
    });
    setTotalAmt(price);

    if (price <= 300000) {
      setShippingCharge(30000);
    } else if (price <= 1000000) {
      setShippingCharge(15000);
    } else if (price > 2000000) {
      setShippingCharge(0);
    }
  }, [products]);

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      const response = await axios.post(
        `${API_HOST}/orders/create`,
        {
          products: products.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.image,
          })),
          shippingAddress: userData.address,
          totalAmount: totalAmt + shippingCharge,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // Order placed successfully
        navigate("/checkout-success");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="w-full bg-gray-50">
      <Header />
      <div className="max-w-container mx-auto px-4">
        <Breadcrumbs title="Thanh toán" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
          {/* Customer Information */}
          <div className="bg-[#F5F7F7] p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">
              Thông tin khách hàng
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={userData.username || ""}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={userData.phone || ""}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={userData.email || ""}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ giao hàng
                </label>
                <textarea
                  value={userData.address || ""}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#F5F7F7] p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Tóm tắt đơn hàng</h2>
            <div className="space-y-4">
              {products.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">{item.price * item.quantity}đ</p>
                </div>
              ))}

              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{totalAmt}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{shippingCharge}đ</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-4 border-t">
                  <span>Tổng cộng</span>
                  <span>{totalAmt + shippingCharge}đ</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full py-3 mt-6 bg-primeColor text-white rounded-md hover:bg-black transition duration-300"
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <FooterBottom />
    </div>
  );
};

export default Checkout;
