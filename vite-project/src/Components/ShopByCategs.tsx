import CategoriesCard from "./CategoriesCard";
type ShopByCategsProps = {
  category: string;
  setCateg: React.Dispatch<React.SetStateAction<string>>;
};
const ShopByCategs = (props: ShopByCategsProps) => {
  return (
    <section className="flex flex-col items-center gap-[28px] py-[48px] h-[450px] bg-gray-100">
      <h1 className="text-center text-4xl font-semibold w-full">
        Shop by Categories
      </h1>
      <div className="h-[300px] py-5 w-full flex justify-center gap-[24px]">
        <CategoriesCard
          imgsrc="https://www.oaks.delivery/wp-content/uploads/Jack-Daniels-Honey-Whiskey-1-1600x900-1-1200x900-cropped.webp"
          name="Whiskey"
          onClickHandle={() => {
            props.setCateg("Whiskey");
          }}
        />
        <CategoriesCard
          imgsrc="https://www.wheatleyvodka.com/media_133f71a3e1a71c230536dd8e163189cd5c6269173.png?width=750&format=png&optimize=medium"
          name="Vodka"
          onClickHandle={() => {
            props.setCateg("Vodka");
          }}
        />
        <CategoriesCard
          imgsrc="https://drinkdrystore.com/cdn/shop/files/CoronaCero_10_2d93fcd8-dcd0-441e-8246-dfc551c255b1_1920x.webp?v=1711884989"
          name="Beer"
          onClickHandle={() => {
            props.setCateg("Beer");
          }}
        />
        <CategoriesCard
          imgsrc="https://lymebaywinery.co.uk/wp-content/uploads/2015/08/026-Blackberry-GLASS_SQUARE-1024x1024.jpg"
          name="Wine"
          onClickHandle={() => {
            props.setCateg("Wine");
          }}
        />
        <CategoriesCard
          imgsrc="https://www.oakandbarrelnyc.com/wp-content/uploads/2018/10/Captain-Morgan-Original-Spiced-Rum-375ml.jpg"
          name="Rum"
          onClickHandle={() => {
            props.setCateg("Rum");
          }}
        />
        <CategoriesCard
          imgsrc="https://bodegaslacatedral.com/cdn/shop/files/Tequila_donjulio_blanco_bodegas_la_catedral..jpg?v=1704470960&width=640"
          name="Tequila"
          onClickHandle={() => {
            props.setCateg("Tequila");
          }}
        />
      </div>
    </section>
  );
};

export default ShopByCategs;
