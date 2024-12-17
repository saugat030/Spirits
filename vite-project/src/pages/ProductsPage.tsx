// import NavBar from "../Components/NavBar";
const ProductsPage = () => {
  return (
    <div className="bg-slate-600 h-screen">
      {/* <NavBar page="products" /> */}
      <section className="flex flex-col items-center gap-[48px] py-[48px] bg-slate-500 h-[390px]">
        <h1 className="text-center text-4xl font-semibold">
          Shop by Categories.
        </h1>
        <div className="h-[201px] bg-red-500 flex gap-[24px]"></div>
      </section>
    </div>
  );
};

export default ProductsPage;
