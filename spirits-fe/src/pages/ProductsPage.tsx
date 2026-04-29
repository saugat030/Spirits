import ShopByCategs from "../components/ShopByCategs";
import MostPopular from "../components/MostPopular";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetProducts } from "../services/api/productsApi";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const alcName = searchParams.get("name");
  const categories = searchParams.getAll("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const [category, setCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);

  const getTypeParam = () => {
    if (categories.length > 0) return categories; // useGetProducts handles arrays or comma-separated depending on its implementation
    if (category) return category;
    return null;
  };

  const apiParams = {
    category: getTypeParam(),
    name: alcName || null,
    minPrice: minPrice ? parseInt(minPrice) : null,
    maxPrice: maxPrice ? parseInt(maxPrice) : null,
    page: currentPage,
    limit: itemsPerPage,
  };

  const { data: productsData, error, isLoading } = useGetProducts(apiParams);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (newCategory: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    // when clicking a category from ShopByCategs replace every other filter
    newSearchParams.delete("category");
    if (newCategory) {
      newSearchParams.set("category", newCategory);
    }
    const queryString = newSearchParams.toString();
    navigate(queryString ? `?${queryString}` : "/products");
  };

  useEffect(() => {
    // if exactly one category is selected in the url highlight it in ShopByCategs
    const newCategory = categories.length === 1 ? categories[0] : "";
    if (category !== newCategory) {
      setCategory(newCategory);
      setCurrentPage(1);
    }
  }, [categories, category]);

  // reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [alcName, categories.join(","), minPrice, maxPrice]);

  return (
    <div className="bg-white min-h-screen">
      <ShopByCategs category={category} setCateg={handleCategoryChange} />
      <MostPopular
        title={alcName ? `Results for "${alcName}"` : "Most Popular"}
        products={productsData}
        error={error}
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductsPage;
