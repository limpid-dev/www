import Link from "next/link";
import React from "react";

function Pagination({
  totalItems,
  currentPage,
  itemsPerPage,
  renderPageLink,
  firstPageUrl,
  lastPageUrl,
  nextPageUrl,
  previousPageUrl,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageLink = (page) => {
    return renderPageLink(page);
  };

  const renderPaginationLinks = () => {
    const links = [];

    // Render link for the first page
    if (firstPageUrl) {
      links.push(
        <Link key="first" href={firstPageUrl}>
          <a>First</a>
        </Link>
      );
    }

    // Render link for the previous page
    if (previousPageUrl) {
      links.push(
        <Link key="previous" href={previousPageUrl}>
          <a>Previous</a>
        </Link>
      );
    }

    // Render links for individual pages
    for (let page = 1; page <= totalPages; page++) {
      const pageLink = getPageLink(page);
      links.push(
        <Link key={page} href={pageLink}>
          {page}
        </Link>
      );
    }

    // Render link for the next page
    if (nextPageUrl) {
      links.push(
        <Link key="next" href={nextPageUrl}>
          Next
        </Link>
      );
    }

    // Render link for the last page
    if (lastPageUrl) {
      links.push(
        <Link key="last" href={lastPageUrl}>
          Last
        </Link>
      );
    }

    return links;
  };
}

export default Pagination;
