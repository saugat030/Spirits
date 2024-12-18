import Products from "./Products";
import { useEffect, useState } from "react";
import axios from "axios";
import { productType } from "./BestSelling";

const MostPopular = () => {
  const [products, setProducts] = useState<productType[]>([]);
  const [error, setError] = useState<string>("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/products`);
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products"); // Handle errors
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <section className="container mx-auto">
      <h1 className="text-4xl font-bold mt-12 px-8">Most Popular</h1>
      <div className="flex flex-wrap gap-[48px] py-12 px-8 items-center">
        {products.slice(0, 40).map((item: productType) => {
          return (
            <Products
              imgsrc={item.image_link}
              name={item.name ? item.name : error}
              price={item.price}
            />
          );
        })}
      </div>
    </section>
  );
};

export default MostPopular;
