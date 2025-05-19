import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const API_HOST = process.env.REACT_APP_API_HOST;

const HeaderBottom = () => {
  const [user, setUser] = useState(null);
  const products = useSelector((state) => state.orebiReducer.products);
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (ref.current.contains(e.target)) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
  }, [show, ref]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Xóa timeout cũ nếu có
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Nếu query rỗng thì không gọi API
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Set timeout mới
    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_HOST}/product/search?name=${query}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // Delay 2 giây
  };

  const handleProductClick = (product) => {
    // Chuyển đến trang chi tiết sản phẩm với id
    navigate(`/product/${product.id}`, {
      state: {
        item: {
          _id: product.id,
          productName: product.name,
          img: API_HOST + product.img,
          price: product.price,
          color: product.color || "",
          badge: product.badge || false,
          des: product.description || "",
        },
      },
    });
    // Reset search
    setSearchQuery("");
    setSearchResults([]);
  };

  useEffect(() => {
    // Cleanup timeout khi component unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          <div
            onClick={() => setShow(!show)}
            ref={ref}
            className="flex h-14 cursor-pointer items-center gap-2 text-primeColor"
          >
            <HiOutlineMenuAlt4 className="w-5 h-5" />
            <p className="text-[14px] font-normal">Danh mục sản phẩm</p>

            {show && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-36 z-50 bg-primeColor w-auto text-[#767676] h-auto p-4 pb-6"
              >
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Phụ kiện
                </li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Dụng cụ thể thao
                </li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Thiết bị điện tử
                </li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Quần áo thể thao
                </li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Túi xách
                </li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400  hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Dụng cụ tập luyện
                </li>
              </motion.ul>
            )}
          </div>
          <div className="relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
            <input
              className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
              type="text"
              onChange={handleSearch}
              value={searchQuery}
              placeholder="Tìm kiếm sản phẩm của bạn"
            />
            <FaSearch className="w-5 h-5" />
            {searchQuery && (
              <div
                className={`w-full mx-auto h-96 bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Đang tìm kiếm...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <div
                      onClick={() => handleProductClick(item)}
                      key={item._id}
                      className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3 p-2 hover:bg-gray-200 transition-colors duration-200"
                    >
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          className="w-full h-full object-cover rounded"
                          src={`${API_HOST}${item.img}`}
                          alt={item.name}
                        />
                      </div>
                      <div className="flex flex-col gap-1 flex-grow">
                        <p className="font-semibold text-lg truncate">
                          {item.name}
                        </p>
                        <p className="text-primeColor font-bold">
                          {item.price}đ
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p>Không tìm thấy sản phẩm</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
            <div onClick={() => setShowUser(!showUser)} className="flex">
              <FaUser />
              <FaCaretDown />
            </div>
            {showUser && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-6 left-0 z-50 bg-primeColor w-44 text-[#767676] h-auto p-4 pb-6"
              >
                {user ? (
                  <>
                    <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                      Xin chào, {user.username || "Người dùng"}
                    </li>
                    <Link to="/orders">
                      <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                        Đơn hàng của tôi
                      </li>
                    </Link>
                    <li
                      onClick={() => {
                        localStorage.removeItem("token");
                        setUser(null);
                        navigate("/signin");
                      }}
                      className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer"
                    >
                      Đăng xuất
                    </li>
                  </>
                ) : (
                  <>
                    <Link to="/signin">
                      <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                        Đăng nhập
                      </li>
                    </Link>
                    <Link to="/signup">
                      <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                        Đăng ký
                      </li>
                    </Link>
                  </>
                )}
              </motion.ul>
            )}
            <Link to="/cart">
              <div className="relative">
                <FaShoppingCart />
                <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
                  {products.length > 0 ? products.length : 0}
                </span>
              </div>
            </Link>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;
