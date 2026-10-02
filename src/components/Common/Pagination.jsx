import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { PaginationNav, PageButton, Ellipsis } from "./Pagination.styles";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  pageRange = 2,
}) => {
  if (totalPages <= 1) return null;

  const goTo = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange?.(page);
  };

  const pages = [];
  const start = Math.max(2, currentPage - pageRange);
  const end = Math.min(totalPages - 1, currentPage + pageRange);

  pages.push(1);
  if (start > 2) pages.push("start-ellipsis");
  for (let p = start; p <= end; p += 1) pages.push(p);
  if (end < totalPages - 1) pages.push("end-ellipsis");
  if (totalPages > 1) pages.push(totalPages);

  return (
    <PaginationNav aria-label="페이지 네비게이션">
      <PageButton
        type="button"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <FiChevronLeft />
      </PageButton>

      {pages.map((p) =>
        typeof p === "string" ? (
          <Ellipsis key={p}>…</Ellipsis>
        ) : (
          <PageButton
            key={p}
            type="button"
            $active={p === currentPage}
            aria-current={p === currentPage ? "page" : undefined}
            onClick={() => goTo(p)}
          >
            {p}
          </PageButton>
        ),
      )}

      <PageButton
        type="button"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <FiChevronRight />
      </PageButton>
    </PaginationNav>
  );
};

export default Pagination;
