import NavBar from "../Components/NavBar";
import ShopByCategs from "../Components/ShopByCategs";
import MostPopular from "../Components/MostPopular";
import Footer from "../Components/Footer";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetProducts } from "../services/api/productsApi";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const alcName = searchParams.get("name");
  const type = searchParams.get("type");

  const [category, setCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);

  const {
    data: productsData,
    error,
    isLoading,
  } = useGetProducts({
    type: category,
    name: alcName,
    page: currentPage,
    limit: itemsPerPage,
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (newCategory: string) => {
    // Build new search params
    const newSearchParams = new URLSearchParams();

    // Keep the name param if it exists
    if (alcName) {
      newSearchParams.set("name", alcName);
    }

    // Add type param if category is selected
    if (newCategory) {
      newSearchParams.set("type", newCategory);
    }

    // Navigate with the new params - this will trigger the useEffect to update state
    const queryString = newSearchParams.toString();
    navigate(queryString ? `?${queryString}` : "/products");
  };

  // Initialize and sync category from URL params
  useEffect(() => {
    const newCategory = type || "";
    if (category !== newCategory) {
      setCategory(newCategory);
      setCurrentPage(1);
    }
  }, [type]);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [alcName]);

  return (
    <div className="font-Poppins overflow-hidden">
      <NavBar page="products" />
      <ShopByCategs category={category} setCateg={handleCategoryChange} />
      <MostPopular
        title={alcName ? `Showing results for " ${alcName} "` : "Most Popular"}
        products={productsData}
        error={error}
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <Footer size="lg" />
    </div>
  );
};

export default ProductsPage;
