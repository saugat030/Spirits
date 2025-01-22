import NavBar from "../Components/NavBar";
import ShopByCategs from "../Components/ShopByCategs";
import MostPopular from "../Components/MostPopular";
import Footer from "../Components/Footer";
import { useEffect, useState } from "react";
import { productType } from "../Components/BestSelling";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export type MostPopularProps = {
  productsValue: productType[];
  error: string;
};
const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const alcName = searchParams.get("name");
  const [products, setProducts] = useState<productType[]>([]);
  const [error, setError] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/products?type=${category}&name=${alcName}`
      );
      setProducts(response.data.statistics);
      console.log(response.data.page);
    } catch (err) {
      setError("Failed to fetch products"); // Handle errors
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, alcName]);

  return (
    <div className="font-Poppins">
      <NavBar page="products" />
      <ShopByCategs category={category} setCateg={setCategory} />
      <MostPopular productsValue={products} error={error} />
      <Footer size="lg" />
    </div>
  );
};

export default ProductsPage;
