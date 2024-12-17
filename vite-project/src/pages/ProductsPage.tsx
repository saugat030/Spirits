import CategoriesCard from "../Components/CategoriesCard";
import NavBar from "../Components/NavBar";
const ProductsPage = () => {
  return (
    <div className="font-Poppins">
      <NavBar page="products" />
      <section className="flex flex-col items-center gap-[48px] py-[48px] bg-slate-600  h-[450px]">
        <h1 className="text-center text-4xl font-semibold w-full">
          Shop by Categories
        </h1>
        <div className="h-[300px] bg-white py-5 w-full flex justify-center gap-[24px]">
          <CategoriesCard />
          <CategoriesCard />
          <CategoriesCard />
          <CategoriesCard />
          <CategoriesCard />
          <CategoriesCard />
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
