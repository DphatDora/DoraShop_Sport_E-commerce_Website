import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";

const API_HOST = process.env.REACT_APP_API_HOST;

function Items({ currentItems }) {
  return (
    <>
      {currentItems &&
        currentItems.map((item) => (
          <div key={item._id} className="w-full">
            <Product
              key={item._id}
              _id={item.id}
              img={`${API_HOST}${item.img}`}
              productName={item.name}
              price={item.price}
              soldQuantity={item.soldQuantity}
              categoryId={item.categoryId}
              des={item.description}
              brand={item.brand}
            />
          </div>
        ))}
    </>
  );
}

const Pagination = ({ itemsPerPage, products }) => {
  const [itemOffset, setItemOffset] = useState(0);

  // Xác định điểm kết thúc của trang
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = products.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  // Xử lý khi chuyển trang
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);
  };

  return (
    <div>
      {/* Hiển thị danh sách sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
        <Items currentItems={currentItems} />
      </div>

      {/* Thanh phân trang */}
      {products.length > itemsPerPage && (
        <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
          <ReactPaginate
            nextLabel="Next"
            previousLabel="Prev"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
            pageClassName="mr-6"
            containerClassName="flex text-base font-semibold font-titleFont py-10"
            activeClassName="bg-black text-white"
          />

          <p className="text-base font-normal text-lightText">
            Showing {itemOffset + 1} to {Math.min(endOffset, products.length)}{" "}
            of {products.length} products
          </p>
        </div>
      )}
    </div>
  );
};

export default Pagination;
