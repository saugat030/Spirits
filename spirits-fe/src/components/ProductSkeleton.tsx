import { MdErrorOutline } from "react-icons/md";

interface ProductSkeletonProps {
    skeletonType: "loading" | "error";
    errorMessage?: string | null;
}

const ProductSkeleton = ({ skeletonType, errorMessage }: ProductSkeletonProps) => {
    const baseWrapperStyles = "w-[256px] flex flex-col bg-white rounded-2xl p-3 shadow-sm border border-gray-100";

    if (skeletonType === "error") {
        return (
            <section className={`${baseWrapperStyles} justify-center items-center min-h-[420px] text-center px-4`}>
                <MdErrorOutline className="text-5xl text-red-400 mb-3" />
                <h3 className="text-lg font-bold text-[#0D1B39]">Oops!</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    {errorMessage ? errorMessage : "Failed to load product."}
                </p>
            </section>
        );
    }

    return (
        <section className={baseWrapperStyles}>
            <figure className="relative h-[240px] w-full rounded-xl bg-slate-200 animate-pulse flex-shrink-0">
                <div className="absolute top-2 left-2 h-5 w-16 bg-slate-300/80 rounded-md"></div>
            </figure>
            <div className="flex flex-col flex-grow mt-3">
                <div className="flex justify-between items-center mb-1.5">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-3 w-3 bg-slate-200 rounded-full animate-pulse"></div>
                        ))}
                    </div>
                    <div className="h-3 w-12 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-3/4 bg-slate-300 rounded animate-pulse mb-2 mt-1"></div>
                <div className="space-y-1.5 mt-1">
                    <div className="h-3 w-full bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-3 w-4/5 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="mt-auto pt-4 flex items-center justify-between w-full">
                    <div className="flex flex-col gap-1.5">
                        <div className="h-2 w-8 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-6 w-24 bg-slate-300 rounded animate-pulse"></div>
                    </div>
                    <div className="h-9 w-9 bg-slate-200 rounded-full animate-pulse"></div>
                </div>
            </div>
        </section>
    );
};

export default ProductSkeleton;