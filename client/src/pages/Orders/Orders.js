import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/home/Header/Header";
import Footer from "../../components/home/Footer/Footer";
import FooterBottom from "../../components/home/Footer/FooterBottom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { Star } from "lucide-react";

const API_HOST = process.env.REACT_APP_API_HOST;

const OrderStatus = {
  PENDING: "pending",
  SHIPPING: "shipping",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

const OrderStatusVN = {
  [OrderStatus.PENDING]: "Đang xác nhận",
  [OrderStatus.SHIPPING]: "Đang giao hàng",
  [OrderStatus.DELIVERED]: "Đã giao hàng",
  [OrderStatus.CANCELLED]: "Đã hủy",
};

const Orders = () => {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState(OrderStatus.PENDING);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_HOST}/orders/status?status=${activeStatus}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("API Response:", response.data);
        const ordersData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        console.log("Processed Orders Data:", ordersData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
        console.error("Error details:", error.response?.data);
        if (error.response?.status === 401) {
          navigate("/signin");
        }
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeStatus, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    setSelectedOrder(null);
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      await axios.put(
        `${API_HOST}/orders/update-order`,
        {
          orderId: orderId,
          status: OrderStatus.CANCELLED,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật lại danh sách đơn hàng
      const response = await axios.get(
        `${API_HOST}/orders/status?status=${activeStatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data.data);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    }
  };

  const handleSubmitReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá");
      return;
    }

    try {
      await axios.put(
        `${API_HOST}/orders/update-order`,
        {
          orderId: selectedOrder.id,
          status: selectedOrder.status,
          rate: rating,
          review: review,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật lại danh sách đơn hàng
      const response = await axios.get(
        `${API_HOST}/orders/status?status=${activeStatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data.data);
      setSelectedOrder(null);
      setShowReviewModal(false);
      setRating(0);
      setReview("");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Không thể gửi đánh giá. Vui lòng thử lại sau.");
    }
  };

  const renderStars = (value, isHover = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer ${
              star <= (isHover ? hoverRating : value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-50">
      <Header />
      <div className="max-w-container mx-auto px-4">
        <Breadcrumbs title="Đơn hàng của tôi" />

        <div className="py-10">
          {/* Status Tabs */}
          <div className="flex space-x-4 mb-8">
            {Object.values(OrderStatus).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-6 py-2 rounded-full ${
                  activeStatus === status
                    ? "bg-primeColor text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {OrderStatusVN[status]}
              </button>
            ))}
          </div>

          {/* Orders List or Order Detail */}
          <div className="bg-white rounded-lg shadow-sm">
            {loading ? (
              <div className="p-8 text-center">Đang tải...</div>
            ) : selectedOrder ? (
              // Order Detail View
              <div className="p-6">
                <button
                  onClick={handleBackToList}
                  className="mb-4 text-primeColor hover:underline flex items-center"
                >
                  ← Quay lại danh sách
                </button>
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Chi tiết đơn hàng #{selectedOrder.id}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-gray-600">Ngày đặt hàng:</p>
                      <p className="font-medium">
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Trạng thái:</p>
                      <p className="font-medium">
                        {OrderStatusVN[selectedOrder.status]}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Địa chỉ giao hàng:</p>
                      <p className="font-medium">
                        {selectedOrder.shippingAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tổng tiền:</p>
                      <p className="font-medium">
                        {selectedOrder.totalAmount}đ
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedOrder.status === OrderStatus.PENDING && (
                    <div className="mb-6">
                      <button
                        onClick={() => handleCancelOrder(selectedOrder.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Hủy đơn hàng
                      </button>
                    </div>
                  )}

                  {selectedOrder.status === OrderStatus.DELIVERED &&
                    !selectedOrder.rating && (
                      <div className="mb-6">
                        <button
                          onClick={() => setShowReviewModal(true)}
                          className="px-4 py-2 bg-primeColor text-white rounded-md hover:bg-black"
                        >
                          Đánh giá đơn hàng
                        </button>
                      </div>
                    )}

                  {selectedOrder.rating && (
                    <div className="mb-6">
                      <p className="text-gray-600 mb-2">Đánh giá của bạn:</p>
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(selectedOrder.rating)}
                      </div>
                      {selectedOrder.review && (
                        <p className="text-gray-700">{selectedOrder.review}</p>
                      )}
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-4">Sản phẩm</h4>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-gray-600">
                                Số lượng: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium">
                            {(item.productPrice * item.quantity)}đ
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Orders List View
              <div className="divide-y">
                {!Array.isArray(orders) || orders.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    Không có đơn hàng nào trong trạng thái này
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => handleOrderClick(order)}
                      className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Đơn hàng #{order.id}</h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {order.items.length} sản phẩm
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {order.totalAmount}đ
                          </p>
                          <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-gray-100">
                            {OrderStatusVN[order.status.toUpperCase()]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Đánh giá đơn hàng</h3>
              <div className="mb-4">
                <p className="text-gray-600 mb-2">Số sao:</p>
                {renderStars(rating)}
              </div>
              <div className="mb-4">
                <p className="text-gray-600 mb-2">Nhận xét:</p>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows="4"
                  placeholder="Nhập nhận xét của bạn..."
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setRating(0);
                    setReview("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="px-4 py-2 bg-primeColor text-white rounded-md hover:bg-black"
                >
                  Gửi đánh giá
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <FooterBottom />
    </div>
  );
};

export default Orders;
