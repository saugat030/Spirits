type CategoriesProp = {
  imgsrc: string;
  name: string;
};

const CategoriesCard = (props: CategoriesProp) => {
  return (
    <div className="h-[210px] w-[180px] flex flex-col justify-between items-center hover:scale-110 duration-300 transform">
      <figure className="h-[167px] w-[167px]">
        <img
          src={props.imgsrc}
          alt="vodka"
          className="w-full h-full object-fit rounded-full"
        />
      </figure>
      <h1 className="text-xl text-center w-full">{props.name}</h1>
    </div>
  );
};

export default CategoriesCard;
