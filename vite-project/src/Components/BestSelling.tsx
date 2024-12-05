import Products from "./Products";
const BestSelling = () => {
  return (
    <div className="flex flex-col items-center gap-6 h-[600px] mt-20">
      <h1 className="text-4xl font-bold text-center w-full">Best Selling</h1>
      <div>Buttons:</div>
      <div className="flex gap-20 h-full">
        <Products
          imgsrc="https://pngimg.com/d/whisky_PNG132.png"
          name="Jack Daniels"
        />
        <Products
          imgsrc="https://ebevstore.com/image/cache/catalog/products/International%20Whisky/JohnnieWalker-blue-1-630x520-630x520.png"
          name="Blue Label"
        />
        <Products
          imgsrc="https://www.drinkies.my/_next/image/?url=https%3A%2F%2Fheimy1drinkiespazsasta1.blob.core.windows.net%2Fproductimages%2Ffile_01J7ADHD6225ZJG53JZBG83P58Jameson_Stout_Edition_17254c02.png&w=3840&q=75"
          name="Jameson"
        />
        <Products
          imgsrc="https://thewinebox.biz/wp-content/uploads/2022/01/chivas-regal-25-year-old.png"
          name="Chivas Regal"
        />
      </div>
    </div>
  );
};

export default BestSelling;
