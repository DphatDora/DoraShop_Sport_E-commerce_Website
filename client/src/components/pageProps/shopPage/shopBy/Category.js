import React, { useState } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";

const Category = ({ onCategorySelect, selectedCategory }) => {
  const [showCategories, setShowCategories] = useState(true);
  const categories = [
    {
      categoryId: 1,
      title: "RACKET",
    },
    {
      categoryId: 2,
      title: "SHOES",
    },
    {
      categoryId: 3,
      title: "SHUTTLECOCK",
    },
    {
      categoryId: 4,
      title: "TAPE",
    },
    {
      categoryId: 5,
      title: "NET",
    },
    {
      categoryId: 6,
      title: "ACCESSORIES",
    },
  ];

  const handleCategoryClick = (categoryId) => {
    onCategorySelect(categoryId);
  };

  return (
    <div>
      <div
        onClick={() => setShowCategories(!showCategories)}
        className="cursor-pointer"
      >
        <NavTitle title="Lọc theo Danh mục" icons={true} />
      </div>
      {showCategories && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {categories.map(({ categoryId, title }) => (
              <li
                key={categoryId}
                onClick={() => handleCategoryClick(categoryId)}
                className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between cursor-pointer hover:text-primeColor duration-300 ${
                  selectedCategory === categoryId
                    ? "text-primeColor font-semibold"
                    : ""
                }`}
              >
                {title}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Category;
