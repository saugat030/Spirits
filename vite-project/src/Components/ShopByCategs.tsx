import { CATEGORIES } from "../constants/homepage.constants";
import { ShopByCategsProps } from "../types/home.types";

const ShopByCategs = (props: ShopByCategsProps) => {
  return (
    <section className="flex flex-col items-center gap-[28px] py-[48px] h-[450px] bg-gray-100">
      <h1 className="text-center text-4xl font-semibold w-full">
        Shop by Categories
      </h1>
      <div className="h-[300px] py-5 w-full flex justify-center gap-[24px]">
        {CATEGORIES.map((category) => {
          const isActive = props.category === category.name;
          return (
            <div
              key={category.name}
              onClick={() => props.setCateg(isActive ? "" : category.name)}
              className={`h-[210px] w-[180px] flex flex-col justify-between items-center ${
                isActive ? "hover:scale-100" : "hover:scale-110"
              } duration-300 transform cursor-pointer rounded-xl`}
            >
              <figure
                className={`h-[167px] w-[167px] rounded-full overflow-hidden p-1 ${
                  isActive ? "border-2 border-amber-600" : ""
                }`}
              >
                <img
                  src={category.imgsrc}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </figure>
              <h1 className="text-xl text-center w-full">{category.name}</h1>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ShopByCategs;
