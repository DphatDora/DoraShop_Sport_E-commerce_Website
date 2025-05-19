import React from "react";
import Brand from "./shopBy/Brand";
import Category from "./shopBy/Category";

const ShopSideNav = ({
  onCategorySelect,
  onBrandSelect,
  selectedCategory,
  selectedBrand,
}) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Category
        onCategorySelect={onCategorySelect}
        selectedCategory={selectedCategory}
      />
      <Brand onBrandSelect={onBrandSelect} selectedBrand={selectedBrand} />
      
    </div>
  );
};

export default ShopSideNav;
