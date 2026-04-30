interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  isLoading = false,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const buttons: (number | string)[] = [];
  const maxButtons = 7;

  if (totalPages <= maxButtons) {
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(i);
    }
  } else {
    buttons.push(1);

    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 4);
    }

    if (startPage > 2) buttons.push("...");

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }

    if (endPage < totalPages - 1) buttons.push("...");
    buttons.push(totalPages);
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2">
      <button
        disabled={currentPage === 1 || isLoading}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-4 py-2 text-sm font-medium rounded-lg border ${
          currentPage === 1 || isLoading
            ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 transition-colors"
        }`}
      >
        Previous
      </button>
      {buttons.map((item, index) => (
        <button
          key={`${item}-${index}`}
          disabled={item === "..." || isLoading}
          onClick={() => typeof item === "number" && onPageChange(item)}
          className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg border ${
            item === currentPage
              ? "bg-orange-600 text-white border-orange-600 shadow-sm"
              : item === "..."
              ? "text-slate-400 border-transparent cursor-default"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 transition-colors"
          }`}
        >
          {item}
        </button>
      ))}
      <button
        disabled={currentPage === totalPages || isLoading}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-4 py-2 text-sm font-medium rounded-lg border ${
          currentPage === totalPages || isLoading
            ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 transition-colors"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
