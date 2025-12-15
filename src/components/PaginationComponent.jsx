import { Pagination } from 'react-bootstrap'

const PaginationComponent = ({ currentPage, totalPages, onPageChange, showInfo = true, totalItems = 0, itemsPerPage = 0 }) => {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const pages = getPageNumbers()
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  const endItem = totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : 0

  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
      {showInfo && totalItems > 0 && (
        <div className="text-muted">
          Showing {startItem} to {endItem} of {totalItems} entries
        </div>
      )}
      <Pagination className="mb-0">
        <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />

        {pages[0] > 1 && (
          <>
            <Pagination.Item onClick={() => onPageChange(1)}>{1}</Pagination.Item>
            {pages[0] > 2 && <Pagination.Ellipsis />}
          </>
        )}

        {pages.map((page) => (
          <Pagination.Item key={page} active={page === currentPage} onClick={() => onPageChange(page)}>
            {page}
          </Pagination.Item>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <Pagination.Ellipsis />}
            <Pagination.Item onClick={() => onPageChange(totalPages)}>{totalPages}</Pagination.Item>
          </>
        )}

        <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    </div>
  )
}

export default PaginationComponent



