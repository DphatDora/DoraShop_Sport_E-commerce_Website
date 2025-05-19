import React, { useState, useEffect } from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import axios from "axios";

const API_HOST = process.env.REACT_APP_API_HOST;

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(`${API_HOST}/product/best-selling`);
        setBestSellers(response.data);
      } catch (err) {
        console.error("Error fetching bestsellers:", err);
        setError("Failed to load bestsellers");
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <div className="w-full pb-20">
      <Heading heading="Sản phẩm bán chạy " />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
          {bestSellers.length > 0 ? (
            bestSellers.map((item) => (
              <Product
                _id={item.id}
                img={`${API_HOST}${item.img}`}
                productName={item.name}
                price={item.price}
                soldQuantity={item.soldQuantity}
                categoryId={item.categoryId}
                des={item.description}
                brand={item.brand}
              />
            ))
          ) : (
            <p>No bestsellers available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BestSellers;
