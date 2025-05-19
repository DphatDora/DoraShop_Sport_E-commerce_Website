import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import { emptyCart } from "../../assets/images/index";
import ItemCard from "./ItemCard";

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiReducer.products);
  const [totalAmt, setTotalAmt] = useState("");
  const [shippingCharge, setShippingCharge] = useState("");
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    let price = 0;
    products.map((item) => {
      price += item.price * item.quantity;
      return price;
    });
    setTotalAmt(price);
  }, [products]);
  useEffect(() => {
    if (totalAmt <= 300000) {
      setShippingCharge(30000);
    } else if (totalAmt <= 1000000) {
      setShippingCharge(15000);
    } else if (totalAmt > 2000000) {
      setShippingCharge(0);
    }
  }, [totalAmt]);

  const handleApplyCoupon = () => {
    // Xử lý logic áp dụng mã giảm giá ở đây
    alert("Chức năng đang được phát triển!");
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Giỏ hàng" />
      {products.length > 0 ? (
        <div className="pb-20">
          <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
            <h2 className="col-span-2">Sản phẩm</h2>
            <h2>Giá</h2>
            <h2>Số lượng</h2>
            <h2>Tổng tiền</h2>
          </div>
          <div className="mt-5">
            {products.map((item) => (
              <div key={item._id}>
                <ItemCard item={item} />
              </div>
            ))}
          </div>

          <button
            onClick={() => dispatch(resetCart())}
            className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
          >
            Xóa giỏ hàng
          </button>

          <div className="flex flex-col mdl:flex-row justify-between border py-4 px-4 items-center gap-2 mdl:gap-0">
            <div className="flex items-center gap-4">
              <input
                className="w-44 mdl:w-52 h-8 px-4 border text-primeColor text-sm outline-none border-gray-400"
                type="text"
                placeholder="Mã giảm giá"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button
                onClick={handleApplyCoupon}
                className="text-sm mdl:text-base font-semibold bg-primeColor text-white px-4 py-1 hover:bg-black duration-300"
              >
                Áp dụng mã
              </button>
            </div>
            
          </div>
          <div className="max-w-7xl gap-4 flex justify-end mt-4">
            <div className="w-96 flex flex-col gap-4">
              <h1 className="text-2xl font-semibold text-right">
                Tổng giỏ hàng
              </h1>
              <div>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Tạm tính
                  <span className="font-semibold tracking-wide font-titleFont">
                    {totalAmt}đ
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Phí vận chuyển
                  <span className="font-semibold tracking-wide font-titleFont">
                    {shippingCharge}đ
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
                  Tổng cộng
                  <span className="font-bold tracking-wide text-lg font-titleFont">
                    {totalAmt + shippingCharge}đ
                  </span>
                </p>
              </div>
              <div className="flex justify-end">
                <Link to="/checkout">
                  <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300">
                    Thanh toán
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
        >
          <div>
            <img
              className="w-80 rounded-lg p-4 mx-auto"
              src={emptyCart}
              alt="emptyCart"
            />
          </div>
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Giỏ hàng của bạn đang trống
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Giỏ hàng của bạn đang rất trống trải. Hãy thêm các sản phẩm thể
              thao yêu thích vào giỏ hàng để làm nó vui vẻ hơn.
            </p>
            <Link to="/shop">
              <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                Tiếp tục mua sắm
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
