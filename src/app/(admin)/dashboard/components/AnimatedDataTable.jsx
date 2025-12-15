import { useState, useMemo } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Table, Form, InputGroup, Button, Badge, Spinner } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useTranslation } from 'react-i18next'
import PaginationComponent from '@/components/PaginationComponent'
import { getImageUrl } from '@/utils/image-url'

// Image Cell Component
const ImageCell = ({ value }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const imageUrl = value ? getImageUrl(value) : null

  if (!imageUrl) {
    return (
      <div
        className="rounded-circle bg-light d-flex align-items-center justify-content-center"
        style={{ width: '40px', height: '40px' }}
      >
        <IconifyIcon icon="solar:user-bold-duotone" className="text-muted" />
      </div>
    )
  }

  return (
    <div className="position-relative" style={{ width: '40px', height: '40px' }}>
      {imageLoading && (
        <div
          className="position-absolute top-0 start-0 rounded-circle bg-light d-flex align-items-center justify-content-center"
          style={{ width: '40px', height: '40px' }}
        >
          <Spinner animation="border" size="sm" />
        </div>
      )}
      {imageError ? (
        <div
          className="rounded-circle bg-light d-flex align-items-center justify-content-center"
          style={{ width: '40px', height: '40px' }}
        >
          <IconifyIcon icon="solar:user-bold-duotone" className="text-muted" />
        </div>
      ) : (
        <img
          src={imageUrl}
          alt=""
          className="rounded-circle"
          style={{ width: '40px', height: '40px', objectFit: 'cover', display: imageLoading ? 'none' : 'block' }}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true)
            setImageLoading(false)
          }}
        />
      )}
    </div>
  )
}

const AnimatedDataTable = ({
  title,
  data = [],
  columns = [],
  loading = false,
  onRowClick,
  actions,
  searchable = true,
  paginated = true,
  pageSize = 10,
  emptyMessage = 'No data available',
}) => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data

    return data.filter((row) => {
      return columns.some((col) => {
        const value = col.accessor ? col.accessor(row) : row[col.key]
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(searchTerm.toLowerCase())
      })
    })
  }, [data, searchTerm, columns])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = columns.find((col) => col.key === sortConfig.key)?.accessor
        ? columns.find((col) => col.key === sortConfig.key).accessor(a)
        : a[sortConfig.key]
      const bValue = columns.find((col) => col.key === sortConfig.key)?.accessor
        ? columns.find((col) => col.key === sortConfig.key).accessor(b)
        : b[sortConfig.key]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
    })
  }, [filteredData, sortConfig, columns])

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize, paginated])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <IconifyIcon icon="bx:sort" className="text-muted" />
    }
    return sortConfig.direction === 'asc' ? (
      <IconifyIcon icon="bx:sort-up" className="text-primary" />
    ) : (
      <IconifyIcon icon="bx:sort-down" className="text-primary" />
    )
  }

  const formatCellValue = (value, column) => {
    if (value === null || value === undefined) return '—'

    if (column.format) {
      return column.format(value)
    }

    if (column.type === 'badge') {
      const status = String(value).toLowerCase()
      const variant = column.badgeVariant?.(value) || (status === 'active' ? 'success' : 'secondary')
      return <Badge bg={variant}>{String(value)}</Badge>
    }

    if (column.type === 'image') {
      return <ImageCell value={value} />
    }

    if (column.type === 'date' && value) {
      try {
        return new Date(value).toLocaleDateString()
      } catch {
        return String(value)
      }
    }

    return String(value)
  }

  return (
    <Card className="animated-card">
      <CardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <CardTitle as={'h5'} className="mb-0">
            {title}
          </CardTitle>
          <p className="text-muted mb-0 small">
            {t('Total')}: {filteredData.length} {t('items')}
          </p>
        </div>
        {actions && <div className="d-flex gap-2">{actions}</div>}
      </CardHeader>
      <CardBody>
        {searchable && (
          <div className="mb-3 animated-fade-in">
            <InputGroup>
              <InputGroup.Text>
                <IconifyIcon icon="bx:search" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={t('Search...')}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
              {searchTerm && (
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchTerm('')
                    setCurrentPage(1)
                  }}
                >
                  <IconifyIcon icon="bx:x" />
                </Button>
              )}
            </InputGroup>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">{t('Loading...')}</p>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="text-center py-5">
            <IconifyIcon icon="solar:document-text-bold-duotone" className="fs-48 text-muted" />
            <p className="text-muted mt-2">{emptyMessage}</p>
          </div>
        ) : (
          <>
            <div className="table-responsive animated-fade-in">
              <Table hover responsive className="mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        style={{ cursor: column.sortable !== false ? 'pointer' : 'default', userSelect: 'none' }}
                        onClick={() => column.sortable !== false && handleSort(column.key)}
                        className={column.sortable !== false ? 'user-select-none' : ''}
                      >
                        <div className="d-flex align-items-center gap-2">
                          {column.label || column.key}
                          {column.sortable !== false && getSortIcon(column.key)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, index) => (
                    <tr
                      key={row.id || index}
                      onClick={() => onRowClick && onRowClick(row)}
                      className={onRowClick ? 'cursor-pointer animated-row' : 'animated-row'}
                      style={{
                        animationDelay: `${index * 0.05}s`,
                      }}
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="align-middle">
                          {formatCellValue(
                            column.accessor ? column.accessor(row) : row[column.key],
                            column
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {paginated && totalPages > 1 && (
              <div className="mt-3 animated-fade-in">
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredData.length}
                  itemsPerPage={pageSize}
                />
              </div>
            )}
          </>
        )}
      </CardBody>
    </Card>
  )
}

export default AnimatedDataTable

