import Products from "./Products";
import { productType } from "./BestSelling";
import FilterSection from "./FilterSection";
import { MostPopularProps } from "../pages/ProductsPage";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { useState } from "react";

const MostPopular = (props: MostPopularProps) => {
  const [hasPrev, setHasPrev] = useState<boolean>(true);
  function handleNextClick() {
    props.setPage((prev) => prev + 1);
  }
  function handlePrevClick() {
    if (props.page == 1) {
      setHasPrev(false);
    } else {
      props.setPage((prev) => Math.max(1, prev - 1));
      setHasPrev(true);
    }
  }

  return (
    <section className="mt-16">
      <div className="flex gap-10">
        <FilterSection />
        <div className="flex flex-col gap-12 flex-1">
          <h1 className="text-4xl font-bold px-5">Most Popular</h1>
          <div className="flex flex-wrap gap-[48px] items-center px-5">
            {props.error ? (
              <h1 className="text-red-500 font-bold text-3xl">{props.error}</h1>
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
          <div className="flex text-2xl justify-center mt-20 gap-10 me-36">
            <button
              className="flex gap-1 items-center"
              onClick={handlePrevClick}
            >
              Previous <GrCaretPrevious />
            </button>
            <button
              className={`flex gap-1 items-center ${
                props.error ? "text-slate-500" : "text-slate-800"
              }`}
              onClick={handleNextClick}
              disabled={props.error != ""}
            >
              <GrCaretNext /> Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MostPopular;
