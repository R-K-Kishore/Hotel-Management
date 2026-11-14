// Pagination component
// Displays Previous/Next buttons and numbered page buttons horizontally centered at the bottom.
// Shows a smart window of page numbers so the UI stays clean with many pages.

function Pagination({ currentPage, totalPages, onPageChange }) {
  // Don't render anything if there's only one page or fewer
  if (totalPages <= 1) return null;

  // Build the list of page numbers to show.
  // Always include: first page, last page, current page, and two neighbours.
  // Insert "..." where pages are skipped.
  function getPageItems() {
    const items = [];

    if (totalPages <= 7) {
      // Few enough pages — just show all numbers
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
      return items;
    }

    // Always show page 1
    items.push(1);

    // Left ellipsis — if current page is far from the start
    if (currentPage > 4) {
      items.push('...');
    }

    // Pages around the current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      items.push(i);
    }

    // Right ellipsis — if current page is far from the end
    if (currentPage < totalPages - 3) {
      items.push('...');
    }

    // Always show last page
    items.push(totalPages);

    return items;
  }

  const pageItems = getPageItems();

  return (
    <div className="pagination-wrapper">
      <div className="pagination">

        {/* Previous button */}
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          Previous
        </button>

        {/* Page number buttons */}
        {pageItems.map((item, index) => {
          // Render "..." as a non-clickable separator
          if (item === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="pagination-ellipsis"
              >
                …
              </span>
            );
          }

          return (
            <button
              key={item}
              className={`pagination-btn ${item === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(item)}
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? 'page' : undefined}
            >
              {item}
            </button>
          );
        })}

        {/* Next button */}
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next
        </button>

      </div>
    </div>
  );
}

export default Pagination;

