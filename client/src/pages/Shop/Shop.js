import React, { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";

const API_HOST = process.env.REACT_APP_API_HOST;

const Shop = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSort, setCurrentSort] = useState("best-selling");
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const fetchProducts = async (categoryId = null, brandName = null) => {
    try {
      setLoading(true);
      let endpoint = "";

      if (categoryId) {
        endpoint = `/product/list-category?categoryId=${categoryId}`;
      } else if (brandName) {
        endpoint = `/product/list-brand?brand=${encodeURIComponent(brandName)}`;
      } else {
        endpoint = "/product/top10-bestselling";
      }

      const response = await axios.get(`${API_HOST}${endpoint}`);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error(
        "Error fetching products:",
        err.response ? err.response.data : err.message
      );
      setError(
        `Failed to load products: ${
          err.response ? err.response.data.message : err.message
        }`
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory, selectedBrand);
  }, [selectedCategory, selectedBrand]);

  const handleSortChange = (sortType) => {
    setCurrentSort(sortType);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedBrand(null);
    setCurrentSort("Best Sellers");
  };

  const handleBrandSelect = (brandName) => {
    setSelectedBrand(brandName);
    setSelectedCategory(null);
    setCurrentSort("Best Sellers");
  };

  const itemsPerPageFromBanner = (items) => {
    setItemsPerPage(items);
  };

  const getSortedProducts = () => {
    let sortedProducts = [...products];

    switch (currentSort) {
      case "best-selling":
        sortedProducts.sort((a, b) => b.soldQuantity - a.soldQuantity);
        break;
      case "new-arrival":
        sortedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "price-inc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }

    return sortedProducts;
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Products" />
      {/* ================= Products Start ================= */}
      <div className="w-full h-full flex pb-20 gap-10">
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <ShopSideNav
            onCategorySelect={handleCategorySelect}
            onBrandSelect={handleBrandSelect}
            selectedCategory={selectedCategory}
            selectedBrand={selectedBrand}
          />
        </div>
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <ProductBanner
                itemsPerPageFromBanner={itemsPerPageFromBanner}
                onSortChange={handleSortChange}
                currentSort={currentSort}
              />
              <Pagination
                itemsPerPage={itemsPerPage}
                products={getSortedProducts()}
              />
            </>
          )}
        </div>
      </div>
      {/* ================= Products End ================= */}
    </div>
  );
};

export default Shop;
