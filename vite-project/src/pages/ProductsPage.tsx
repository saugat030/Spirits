import NavBar from "../Components/NavBar";
import ShopByCategs from "../Components/ShopByCategs";
import MostPopular from "../Components/MostPopular";
import Footer from "../Components/Footer";
import { useEffect, useState } from "react";
import { productType } from "../Components/BestSelling";
import { useSearchParams } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import axios from "axios";

export type MostPopularProps = {
  productsValue: productType[];
  error: string;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
};

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const alcName = searchParams.get("name");
  const [products, setProducts] = useState<productType[]>([]);
  const [error, setError] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/products?type=${category}&name=${alcName}&page=${page}`
      );
      if (response.data.statistics) {
        setProducts(response.data.statistics);
        console.log(response.data.statistics);
        setError("");
      } else {
        setError(response.data.message);
        console.log(response.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };
  console.log(page);
  console.log(error);
  useEffect(() => {
    fetchProducts();
  }, [category, alcName, page]);

  return (
    <div className="font-Poppins">
      <NavBar page="products" />
      <ShopByCategs category={category} setCateg={setCategory} />
      <MostPopular
        productsValue={products}
        error={error}
        setPage={setPage}
        page={page}
      />
      <Footer size="lg" />
    </div>
  );
};

export default ProductsPage;
