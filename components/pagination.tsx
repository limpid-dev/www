import Link from "next/link";
import React from "react";
import usePagination from "../hooks/usePagination";

export interface PaginationProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}

export const dotts = -1;

const Pagination = ({
  totalItems,
  currentPage,
  itemsPerPage,
}: PaginationProps) => {
  const pages = usePagination(totalItems, currentPage, itemsPerPage);

  return (
    <div className="flex items-center justify-center my-8">
      {pages.map((pageNumber, i) =>
        pageNumber === dotts ? (
          <span
            key={i}
            className="px-4 py-2 rounded-full text-sm font-semibold text-black"
          >
            ...
          </span>
        ) : (
          <Link
            key={i}
            href={`/app/profiles/my?page=${pageNumber}`}
            className={`${
              pageNumber === currentPage ? "text-lime-500" : "text-black"
            } px-4 py-2 mx-1 rounded-full text-lg font-semibold no-underline`}
          >
            {pageNumber}
          </Link>
        )
      )}
    </div>
  );
};

export default Pagination;
