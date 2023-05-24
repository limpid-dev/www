import React from "react";
import { Button } from "./primitives/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 3; // Maximum number of visible page numbers

    // Display first page
    items.push(
      <button
        key={1}
        className={`inline-block mx-1 ${
          currentPage === 1
            ? "bg-lime-500 text-white"
            : "bg-slate-100 text-slate-700"
        } rounded-md px-3 py-1 cursor-pointer`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );

    // Display ellipsis if necessary
    if (currentPage > maxVisiblePages - 1) {
      items.push(
        <li
          key="ellipsis-start"
          className="inline-block mx-1 bg-slate-100 text-slate-700 rounded-md px-3 py-1 cursor-default"
        >
          ...
        </li>
      );
    }

    // Calculate start and end range for visible page numbers
    let startPage = currentPage - Math.floor(maxVisiblePages / 2);
    let endPage = currentPage + Math.floor(maxVisiblePages / 2);

    if (startPage < 2) {
      startPage = 2;
      endPage = startPage + maxVisiblePages - 1;
    } else if (endPage > totalPages - 1) {
      endPage = totalPages - 1;
      startPage = endPage - maxVisiblePages + 1;
    }

    // Display visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <button
          key={i}
          className={`inline-block mx-1 ${
            currentPage === i
              ? "bg-lime-500 text-white"
              : "bg-slate-100 text-slate-700"
          } rounded-md px-3 py-1 cursor-pointer`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Display ellipsis if necessary
    if (endPage < totalPages - 1) {
      items.push(
        <li
          key="ellipsis-end"
          className="inline-block mx-1 bg-slate-100 text-slate-700 rounded-md px-3 py-1 cursor-default"
        >
          ...
        </li>
      );
    }

    // Display last page
    items.push(
      <button
        key={totalPages}
        className={`inline-block mx-1 ${
          currentPage === totalPages
            ? "bg-lime-500 text-white"
            : "bg-slate-100 text-slate-700"
        } rounded-md px-3 py-1 cursor-pointer`}
        onClick={() => handlePageChange(totalPages)}
      >
        {totalPages}
      </button>
    );

    return items;
  };

  return (
    <ul className="flex justify-center my-4 fixed inset-x-0 bottom-0">
      <Button
        variant="outline"
        className={`inline-block mx-1 ${
          currentPage === 1 ? "bg-slate-100 text-slate-700" : "bg-lime-500"
        } rounded-md px-3 py-1 cursor-pointer`}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Назад
      </Button>
      {renderPaginationItems()}
      <Button
        variant="outline"
        className={`inline-block mx-1 ${
          currentPage === totalPages
            ? "bg-slate-100 text-slate-700"
            : "bg-lime-500"
        } rounded-md px-3 py-1 cursor-pointer`}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Вперед
      </Button>
    </ul>
  );
};

export default Pagination;
