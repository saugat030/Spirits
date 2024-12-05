import Products from "./Products";

const BestSelling = () => {
  return (
    <div className="flex flex-col items-center gap-6 h-[600px]">
      <h1 className="text-4xl font-bold text-center w-full">Best Selling</h1>
      <div>Buttons:</div>
      <div className="flex gap-20 h-full">
        <Products />
        <Products />
        <Products />
        <Products />
      </div>
    </div>
  );
};

export default BestSelling;
