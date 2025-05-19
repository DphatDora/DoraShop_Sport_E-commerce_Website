import React, { useEffect, useState } from "react";
import axios from "axios";
import Product from "../../home/Products/Product";

const API_HOST = process.env.REACT_APP_API_HOST;

const RelatedProducts = ({ currentProduct }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        if (!currentProduct) {
          setError("Không tìm thấy thông tin sản phẩm");
          setLoading(false);
          return;
        }

        if (!currentProduct._id || !currentProduct.categoryId) {
          setError("Không có sản phẩm liên quan");
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await axios.post(
          `${API_HOST}/product/related-products`,
          {
            categoryId: currentProduct.categoryId,
            productId: currentProduct._id,
          }
        );

        if (response.data && Array.isArray(response.data)) {
          // Map dữ liệu từ response
          const mappedProducts = response.data.map((product) => ({
            _id: product.id,
            productName: product.name,
            img: product.img,
            price: product.price,
            brand: product.brand,
            description: product.description,
            soldQuantity: product.soldQuantity,
          }));
          setRelatedProducts(mappedProducts);
          setError(null);
        } else {
          setError("Dữ liệu trả về không hợp lệ");
        }
      } catch (err) {
        console.error("Error fetching related products:", err);
        setError("Không thể tải sản phẩm liên quan");
      } finally {
        setLoading(false);
      }
    };

    if (currentProduct) {
      fetchRelatedProducts();
    }
  }, [currentProduct]);

  if (loading) {
    return (
      <div>
        <h3 className="font-titleFont text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
          Sản phẩm liên quan
        </h3>
        <div className="flex flex-col gap-2">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3 className="font-titleFont text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
          Sản phẩm liên quan
        </h3>
        <div className="flex flex-col gap-2">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return (
      <div>
        <h3 className="font-titleFont text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
          Sản phẩm liên quan
        </h3>
        <div className="flex flex-col gap-2">
          <p>Không có sản phẩm liên quan</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-titleFont text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
        Sản phẩm liên quan
      </h3>
      <div className="flex overflow-x-auto gap-4 pb-4">
        {relatedProducts.map((item) => (
          <div key={item._id} className="w-[300px] flex-shrink-0">
            <Product
              _id={item._id}
              img={`${API_HOST}${item.img}`}
              productName={item.productName}
              price={item.price}
              soldQuantity={item.soldQuantity}
              categoryId={item.categoryId}
              des={item.description}
              brand={item.brand}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
