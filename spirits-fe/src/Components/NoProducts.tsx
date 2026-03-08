import { FaWineGlassEmpty } from "react-icons/fa6"

export const NoProducts = () => {
    return <div className="flex flex-col items-center justify-center w-full max-w-lg">
        <div className="bg-amber-100/30 p-4 rounded-full shadow-sm mb-4">
            <FaWineGlassEmpty className="text-4xl text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-[#0D1B39] mb-2">
            No products found.
        </h3>
        <p className="text-slate-500 text-sm max-w-sm text-center mb-6">
            We couldn't find any products in this category. Try another tab or
            browse our full collection.
        </p>
        <button
            type="button"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 text-sm rounded-full font-medium transition-colors duration-200 shadow-md"
        >
            Browse All Products
        </button>
    </div>
}