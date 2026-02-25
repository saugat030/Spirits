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

  // Extract all filter parameters from URL
  const alcName = searchParams.get("name");
  const searchTerm = searchParams.get("search");
  const types = searchParams.getAll("type");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const [category, setCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);

  // Prepare parameters for the API call
  const getTypeParam = () => {
    if (types.length > 0) return types;
    if (category) return category;
    return null;
  };

  const apiParams = {
    type: getTypeParam(),
    name: searchTerm || alcName || null,
    minPrice: minPrice ? parseInt(minPrice) : null,
    maxPrice: maxPrice ? parseInt(maxPrice) : null,
    page: currentPage,
    limit: itemsPerPage,
  };

  const { data: productsData, error, isLoading } = useGetProducts(apiParams);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (newCategory: string) => {
    // Build new search params
    const newSearchParams = new URLSearchParams(searchParams);

    // Remove existing type params
    newSearchParams.delete("type");

    // Add new type param if category is selected
    if (newCategory) {
      newSearchParams.set("type", newCategory);
    }

    // Navigate with the new params
    const queryString = newSearchParams.toString();
    navigate(queryString ? `?${queryString}` : "/products");
  };

  // Initialize and sync category from URL params
  useEffect(() => {
    const newCategory = types.length === 1 ? types[0] : "";
    if (category !== newCategory) {
      setCategory(newCategory);
      setCurrentPage(1);
    }
  }, [types]);

  // Reset page when any filter parameter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [alcName, searchTerm, types.join(","), minPrice, maxPrice]);

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
      <Footer />
    </div>
  );
};

export default ProductsPage;
