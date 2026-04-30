import { useGetCategories } from "../services/api/categoryApi";
import { ShopByCategsProps } from "../types/home.types";

const ShopByCategs = (props: ShopByCategsProps) => {
  const { data: categoryResponse, isLoading } = useGetCategories();
  const categories = categoryResponse?.data || [];

  const handleCategoryClick = (categoryName: string) => {
    const isActive = props.category === categoryName;
    const newCategory = isActive ? "" : categoryName;
    props.setCateg(newCategory);
  };

  if (isLoading || categories.length === 0) return null;

  return (
    <section className="flex flex-col items-center gap-7 py-12 min-h-[350px] bg-slate-50">
      <h1 className="text-2xl md:text-3xl font-semibold text-center w-full text-slate-900">
        Shop by Categories
      </h1>
      <div className="py-5 w-full flex flex-wrap justify-center gap-6 px-4">
        {categories.map((category) => {
          const isActive = props.category === category.category_name;
          return (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.category_name)}
              className={`flex flex-col items-center gap-4 ${
                isActive ? "scale-100" : "hover:scale-105"
              } transition-transform duration-300 cursor-pointer w-[160px]`}
            >
              <figure
                className={`w-32 h-32 rounded-full overflow-hidden p-1 ${
                  isActive ? "border-2 border-orange-500 shadow-md" : "border border-slate-200 shadow-sm"
                }`}
              >
                <img
                  src={category.category_image_url}
                  alt={category.category_name}
                  className="w-full h-full object-cover rounded-full bg-white"
                />
              </figure>
              <h2 className={`text-lg text-center ${isActive ? "text-orange-600 font-semibold" : "text-slate-700 font-medium"}`}>
                {category.category_name}
              </h2>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ShopByCategs;
