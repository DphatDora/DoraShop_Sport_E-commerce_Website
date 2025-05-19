const orderRepository = require("../repositories/order.repository");

exports.createOrder = async (userId, orderData) => {
  const orderWithUserId = {
    ...orderData,
    userId: userId
  };
  
  const newOrder = await orderRepository.createOrder(orderWithUserId);
  return newOrder;
};

exports.getOrdersByStatus = async (userId, status) => {
  const orders = await orderRepository.getOrdersByStatus(userId, status);
  return orders;
}

exports.updateOrderStatus = async (orderId, status, rate, review) => {
  const updatedOrder = await orderRepository.updateOrderStatus(orderId, status, rate, review);
  return updatedOrder;
}