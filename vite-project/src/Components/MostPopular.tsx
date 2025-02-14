import Products from "./Products";
import { productType } from "./BestSelling";
import FilterSection from "./FilterSection";
import { MostPopularProps } from "../pages/ProductsPage";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";

const MostPopular = (props: MostPopularProps) => {
  function handleNextClick() {
    props.setPage((prev) => prev + 1);
  }
  function handlePrevClick() {
    props.setPage((prev) => Math.max(1, prev - 1));
  }

  return (
    <section className="mt-16">
      <div className="flex gap-10">
        <FilterSection />
        <div className="flex flex-col gap-12 flex-1">
          <h1 className="text-4xl font-bold px-5">Most Popular</h1>
          <div className="flex flex-wrap gap-[48px] items-center px-5">
            {props.error}
            {props.error ? (
              <h1>No Products Found.</h1>
            ) : (
              props.productsValue.map((item: productType) => {
                return (
                  <Products
                    imgsrc={item.image_link}
                    name={item.name ? item.name : props.error}
                    price={item.price}
                    id={item.id}
                  />
                );
              })
            )}
          </div>
          <div className="flex text-3xl justify-center mt-15 gap-10 text-slate-800 px-40">
            <button className="" onClick={handlePrevClick}>
              <GrCaretPrevious />
            </button>
            <button className="" onClick={handleNextClick}>
              <GrCaretNext />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MostPopular;
