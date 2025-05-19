const orderService = require("../services/order.service");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const orderData = {
      products: req.body.products,
      totalAmount: req.body.totalAmount,
      shippingAddress: req.body.shippingAddress
    };

    const newOrder = await orderService.createOrder(userId, orderData);
    
    res.status(201).json({
      success: true,
      data: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
};

exports.getOrderByStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const status = req.query.status;

    const orders = await orderService.getOrdersByStatus(userId, status);
    
    if (orders.length === 0) {
      return res.status(204).send();
    }
    
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
}

exports.updateOrderStatus = async (req, res) => {
  try {
    const {orderId, status, rate, review} = req.body;
    const updateOrder = await orderService.updateOrderStatus(orderId, status, rate, review);
    if (!updateOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    else {
      return res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: updateOrder,
      });
    }
  }
  catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
}