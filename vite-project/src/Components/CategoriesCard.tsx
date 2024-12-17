const CategoriesCard = () => {
  return (
    <div className="h-[210px] w-[180px] flex flex-col justify-between items-center">
      <figure className="h-[167px] w-[167px]">
        <img
          src="https://www.oaks.delivery/wp-content/uploads/Jack-Daniels-Honey-Whiskey-1-1600x900-1-1200x900-cropped.webp"
          alt="vodka"
          className="w-full h-full object-fit rounded-full"
        />
      </figure>
      <h1 className="text-lg text-center w-full">Vodka</h1>
    </div>
  );
};

export default CategoriesCard;
