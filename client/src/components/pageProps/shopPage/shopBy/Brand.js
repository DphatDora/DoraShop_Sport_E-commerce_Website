import React, { useState } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";

const Brand = ({ onBrandSelect, selectedBrand }) => {
  const [showBrands, setShowBrands] = useState(true);
  const brands = [
    {
      title: "YONEX",
    },
    {
      title: "LI-NING",
    },
    {
      title: "VICTOR",
    },
    {
      title: "TARO",
    },
    {
      title: "VNB",
    },
  ];

  const handleBrandClick = (brandName) => {
    onBrandSelect(brandName);
  };

  return (
    <div>
      <div
        onClick={() => setShowBrands(!showBrands)}
        className="cursor-pointer"
      >
        <NavTitle title="Lọc theo Hãng" icons={true} />
      </div>
      {showBrands && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {brands.map((item) => (
              <li
                key={item.title}
                onClick={() => handleBrandClick(item.title)}
                className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300 cursor-pointer ${
                  selectedBrand === item.title
                    ? "text-primeColor font-semibold"
                    : ""
                }`}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Brand;
