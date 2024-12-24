import Products from "./Products";
import { productType } from "./BestSelling";
import FilterSection from "./FilterSection";
import { MostPopularProps } from "../pages/ProductsPage";

const MostPopular = (props: MostPopularProps) => {
  // const [products, setProducts] = useState<productType[]>([]);
  // const [error, setError] = useState<string>("");
  // const [category, setCategory] = useState<string>("");
  // const fetchProducts = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:3000/api/products?type=${category}`
  //     );
  //     setProducts(response.data);
  //   } catch (err) {
  //     setError("Failed to fetch products"); // Handle errors
  //     console.error(err);
  //   }
  // };

  // useEffect(() => {
  //   fetchProducts();
  // }, []);
  return (
    <section className="mt-16">
      <div className="flex gap-10">
        <FilterSection />
        <div className="flex flex-col gap-12">
          <h1 className="text-4xl font-bold px-5">Most Popular</h1>
          <div className="flex flex-wrap gap-[48px] items-center px-5">
            {props.productsValue.slice(0, 15).map((item: productType) => {
              return (
                <Products
                  imgsrc={item.image_link}
                  name={item.name ? item.name : props.error}
                  price={item.price}
                  id={item.id}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MostPopular;
