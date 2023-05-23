import React, { FC } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const visiblePageCount = 3; // Adjust this value as needed
    const halfVisibleCount = Math.floor(visiblePageCount / 2);

    if (totalPages <= visiblePageCount) {
      // Render all page numbers if the total pages count is less than or equal to the visible page count
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            className={`mx-1 px-3 py-1 rounded-full cursor-pointer ${
              currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      const startPage = Math.max(1, currentPage - halfVisibleCount);
      const endPage = Math.min(totalPages, currentPage + halfVisibleCount);

      if (currentPage - halfVisibleCount > 1) {
        // Render first page
        pageNumbers.push(
          <button
            key={1}
            className={`mx-1 px-3 py-1 rounded-full cursor-pointer ${
              currentPage === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handlePageChange(1)}
          >
            1
          </button>
        );
        if (currentPage - halfVisibleCount > 2) {
          // Render dots if there is a gap between the first page and the visible pages
          pageNumbers.push(
            <span key="dots1" className="mx-1">
              ...
            </span>
          );
        }
      }

      // Render visible page numbers
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <button
            key={i}
            className={`mx-1 px-3 py-1 rounded-full cursor-pointer ${
              currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }

      if (currentPage + halfVisibleCount < totalPages) {
        if (currentPage + halfVisibleCount < totalPages - 1) {
          // Render dots if there is a gap between the visible pages and the last page
          pageNumbers.push(
            <span key="dots2" className="mx-1">
              ...
            </span>
          );
        }
        // Render last page
        pageNumbers.push(
          <button
            key={totalPages}
            className={`mx-1 px-3 py-1 rounded-full cursor-pointer ${
              currentPage === totalPages
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center space-x-2">
      <button
        className={`mx-1 px-3 py-1 rounded-full cursor-pointer ${
          currentPage === 1 ? "bg-gray-200" : "bg-blue-500 text-white"
        }`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {renderPageNumbers()}
      <button
        className={`mx-1 px-3 py-1 rounded-full cursor-pointer ${
          currentPage === totalPages ? "bg-gray-200" : "bg-blue-500 text-white"
        }`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
