import Products from "./Products";
import { productType } from "./BestSelling";
import FilterSection from "./FilterSection";
import { MostPopularProps } from "../pages/ProductsPage";
import { useState } from "react";

const MostPopular = (props: MostPopularProps) => {
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);
  const [indexOfFirst, setIndexOfFirst] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  function handleNextClick() {
    setPage(page + 1);
    setIndexOfFirst(indexOfFirst + 8);
  }
  function handlePrevClick() {
    setPage(page - 1);
    setIndexOfFirst(8 - indexOfFirst);
  }
  console.log(page);
  return (
    <section className="mt-16">
      <div className="flex gap-10">
        <FilterSection />
        <div className="flex flex-col gap-12 flex-1">
          <h1 className="text-4xl font-bold px-5">Most Popular</h1>
          <div className="flex flex-wrap gap-[48px] items-center px-5">
            {props.productsValue
              .slice(indexOfFirst, itemsPerPage + indexOfFirst)
              .map((item: productType) => {
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
          <button className="bg-red-500" onClick={handleNextClick}>
            Next
          </button>
          <button className="bg-red-500" onClick={handlePrevClick}>
            Prev
          </button>
        </div>
      </div>
    </section>
  );
};

export default MostPopular;
