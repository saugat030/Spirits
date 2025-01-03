import Products from "./Products";
import { productType } from "./BestSelling";
import FilterSection from "./FilterSection";
import { MostPopularProps } from "../pages/ProductsPage";

const MostPopular = (props: MostPopularProps) => {
  return (
    <section className="mt-16">
      <div className="flex gap-10">
        <FilterSection />
        <div className="flex flex-col gap-12 flex-1">
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
