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
    setCurrentPage(1); // Reset to first page when category changes
    navigate(`?type=${newCategory}`);
  };

  useEffect(() => {
    if (type && category !== type) {
      setCategory(type);
    }
  }, [type]);

  return (
    <div className="font-Poppins">
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
