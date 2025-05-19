const db = require("../models");
const Order = db.Order;
const OrderItem = db.OrderItem;
const Product = db.Product;

exports.createOrder = async (orderData) => {
  return await db.sequelize.transaction(async (t) => {
    const order = await Order.create(
      {
        userId: orderData.userId,
        totalAmount: orderData.totalAmount,
        shippingAddress: orderData.shippingAddress,
        status: 'pending'
      },
      { transaction: t }
    );

    const orderItems = orderData.products.map(product => ({
      orderId: order.id,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      quantity: product.quantity,
      productImage: product.image
    }));

    await OrderItem.bulkCreate(orderItems, { transaction: t });

    return order;
  });
};

exports.getOrdersByStatus = async (userId, status) => {
  return await Order.findAll({
    where: {
      userId: userId,
      status: status
    },
    include: [
      {
        model: OrderItem,
        as: "items"
      }
    ],
    order: [["createdAt", "DESC"]]
  });
};

exports.updateOrderStatus = async (orderId, status, rate, review) => {
  const transaction = await db.sequelize.transaction();
  try {
    const [affectedRows] = await Order.update(
      { status: status, rating: rate, review: review },
      { where: { id: orderId }, transaction }
    );

    if (affectedRows === 0) {
      await transaction.rollback();
      return null;
    }

    if (status === "delivered" && rate == null) {
      const orderItems = await OrderItem.findAll({
        where: { orderId: orderId },
        transaction,
      });

      for (const item of orderItems) {
        await Product.increment(
          { soldQuantity: item.quantity },
          { where: { id: item.productId }, transaction }
        );
      }
    }

    await transaction.commit();
    return affectedRows;
  } catch (error) {
    await transaction.rollback();
    console.error("Transaction failed:", error);
    throw error;
  }
};

