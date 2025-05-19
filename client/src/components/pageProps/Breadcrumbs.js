import React, { useEffect, useState } from "react";
import { HiOutlineChevronRight } from "react-icons/hi";
import { useLocation } from "react-router-dom";

const Breadcrumbs = ({ prevLocation, title }) => {
  const location = useLocation();
  const [locationPath, setLocationPath] = useState("");
  const [productId, setProductId] = useState("");

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    setLocationPath(pathParts[1]); // Lấy phần đầu tiên (product)
    if (pathParts[2]) {
      setProductId(pathParts[2]); // Lấy ID sản phẩm nếu có
    }
  }, [location]);

  return (
    <div className="w-full py-10 xl:py-10 flex flex-col gap-3">
      <h1 className="text-5xl text-primeColor font-titleFont font-bold">
        {title}
      </h1>
      <p className="text-sm font-normal text-lightText capitalize flex items-center">
        {/* <span> {prevLocation === "" ? "Home" : prevLocation}</span> */}
        <span>Shop</span>
        <span className="px-1">
          <HiOutlineChevronRight />
        </span>
        <span className="capitalize font-semibold text-primeColor">
          {locationPath}
        </span>
        {productId && (
          <>
            <span className="px-1">
              <HiOutlineChevronRight />
            </span>
            <span className="font-semibold text-primeColor">{productId}</span>
          </>
        )}
      </p>
    </div>
  );
};

export default Breadcrumbs;
