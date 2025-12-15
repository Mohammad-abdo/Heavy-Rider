import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { Button, Card, Col, Form, Row, Spinner, Table, Modal } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import PaginationComponent from '@/components/PaginationComponent'
import { useNotificationContext } from '@/context/useNotificationContext'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { getAllDrivers, toggleDriver, updateDriver, deletDriver } from '@/api/api'
import { useTranslation } from 'react-i18next'
import { getImageUrl } from '@/utils/image-url'

const DriversPage = () => {
  const { t } = useTranslation()
  const { showNotification } = useNotificationContext()
  const [filters, setFilters] = useState({ search: '', status: '' })
  const [loading, setLoading] = useState(false)
  const [drivers, setDrivers] = useState([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  })

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', status: 'active', image: null })
  const [toggleLoading, setToggleLoading] = useState(null)

  // Fetch Drivers
  const fetchDrivers = useCallback(
    async (paramsToUse = {}, page = 1) => {
      if (loading) return // Prevent multiple simultaneous calls

      setLoading(true)
      try {
        const params = { ...paramsToUse, page, per_page: pagination.per_page }
        if (!params.search) delete params.search
        if (!params.status) delete params.status

        const response = await getAllDrivers(params)

        // Handle paginated response
        if (response?.meta) {
          setPagination({
            current_page: response.meta.current_page || page,
            last_page: response.meta.last_page || 1,
            per_page: response.meta.per_page || pagination.per_page,
            total: response.meta.total || 0,
          })
          setDrivers(response.data || [])
        } else {
          const items = response?.data || response || []
          setDrivers(items)
          setPagination((prev) => ({
            ...prev,
            current_page: page,
            total: items.length,
            last_page: Math.ceil(items.length / prev.per_page) || 1,
          }))
        }
      } catch (error) {
        const message = error?.response?.data?.message || t('drivers.notifications.fetchFailed')
        showNotification({ variant: 'danger', message })
      } finally {
        setLoading(false)
      }
    },
    [showNotification, loading, pagination.per_page],
  )

  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const isInitialMount = useRef(true)
  const debouncedFilters = useDebounce(filters, 500)

  useEffect(() => {
    if (isMountedRef.current) {
      if (isInitialMount.current) {
        isInitialMount.current = false
        fetchDrivers({}, 1)
      } else {
        setPagination((prev) => ({ ...prev, current_page: 1 }))
        fetchDrivers(debouncedFilters, 1)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters])

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current_page: page }))
    fetchDrivers(debouncedFilters, page)
  }

  const handlePerPageChange = (e) => {
    const perPage = parseInt(e.target.value)
    setPagination((prev) => ({ ...prev, per_page: perPage, current_page: 1 }))
    fetchDrivers(debouncedFilters, 1)
  }

  // Open Delete Modal
  const handleOpenDelete = (driver) => {
    setSelectedDriver(driver)
    setShowDeleteModal(true)
  }

  // Delete Driver
  const handleDelete = async () => {
    try {
      await deletDriver(selectedDriver.id)
      showNotification({ variant: 'success', message: t('drivers.notifications.deleteSuccess') })
      fetchDrivers(debouncedFilters, pagination.current_page)
    } catch (error) {
      const message = error?.response?.data?.message || t('drivers.notifications.deleteFailed')
      showNotification({ variant: 'danger', message })
    } finally {
      setShowDeleteModal(false)
    }
  }

  // Open Edit Modal
  const handleOpenEdit = (driver) => {
    setSelectedDriver(driver)
    setEditForm({
      name: driver.name || '',
      email: driver.email || '',
      phone: driver.phone || '',
      status: driver.status || 'active',
      image: null,
    })
    setShowEditModal(true)
  }

  // Save Edit
  const handleEditSave = async () => {
    try {
      await updateDriver(selectedDriver.id, editForm)
      showNotification({ variant: 'success', message: t('drivers.notifications.updateSuccess') })
      fetchDrivers(debouncedFilters, pagination.current_page)
    } catch (error) {
      const message = error?.response?.data?.message || t('drivers.notifications.updateFailed')
      showNotification({ variant: 'danger', message })
    } finally {
      setShowEditModal(false)
    }
  }

  const handleToggleDriver = async (driver) => {
    setToggleLoading(driver.id)
    try {
      await toggleDriver(driver.id)
      showNotification({
        variant: 'success',
        message: driver.status === 'active' ? t('drivers.notifications.deactivated') : t('drivers.notifications.activated'),
      })
      fetchDrivers(debouncedFilters, pagination.current_page)
    } catch (error) {
      const message = error?.response?.data?.message || t('drivers.notifications.toggleFailed')
      showNotification({ variant: 'danger', message })
    } finally {
      setToggleLoading(null)
    }
  }

  return (
    <>
      <PageTItle title={t('drivers.pageTitle')} />
      <Row className="g-4">
        <Col xl={12}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h4 className="card-title mb-0">{t('drivers.listTitle')}</h4>
                <div className="d-flex gap-2 align-items-center">
                  <Form.Control
                    type="text"
                    placeholder={t('drivers.searchPlaceholder')}
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    style={{ width: '200px' }}
                  />
                  <Form.Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} style={{ width: '150px' }}>
                    <option value="">{t('drivers.filters.allStatus')}</option>
                    <option value="active">{t('drivers.status.active')}</option>
                    <option value="inactive">{t('drivers.status.inactive')}</option>
                  </Form.Select>
                  <Form.Select value={pagination.per_page} onChange={handlePerPageChange} style={{ width: '100px' }} size="sm">
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </Form.Select>
                  <Button variant="light" size="sm" onClick={() => fetchDrivers(debouncedFilters, pagination.current_page)} disabled={loading}>
                    <IconifyIcon icon="solar:refresh-bold" className="me-1" /> {t('drivers.actions.refresh')}
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover responsive className="mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>{t('id')}</th>
                      <th>{t('drivers.table.image')}</th>
                      <th>{t('drivers.table.name')}</th>
                      <th>{t('drivers.table.email')}</th>
                      <th>{t('drivers.table.phone')}</th>
                      <th>{t('drivers.table.status')}</th>
                      <th>{t('drivers.table.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          <Spinner animation="border" size="sm" className="me-2" /> {t('drivers.loading')}
                        </td>
                      </tr>
                    ) : drivers.length ? (
                      drivers.map((driver, idx) => (
                        <tr key={driver?.id ?? idx}>
                          <td>{driver?.id ?? '-'}</td>
                          <td>
                            <img
                              src={driver?.image ? getImageUrl(driver.image) : 'https://via.placeholder.com/40'}
                              className="avatar avatar-sm rounded-circle me-2"
                              alt=""
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40'
                              }}
                            />
                          </td>
                          <td>{driver?.name ?? '-'}</td>
                          <td>{driver?.email ?? '-'}</td>
                          <td>{driver?.phone ?? '-'}</td>
                          <td>
                            <span className={`badge ${driver?.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                              {driver?.status ? t(`drivers.status.${driver.status}`) : '-'}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button size="sm" variant="outline-primary" onClick={() => handleOpenEdit(driver)}>
                                {t('drivers.actions.edit')}
                              </Button>
                              <Button size="sm" variant="outline-danger" onClick={() => handleOpenDelete(driver)}>
                                {t('drivers.actions.delete')}
                              </Button>
                              <Button
                                size="sm"
                                variant={driver.status === 'active' ? 'outline-secondary' : 'outline-success'}
                                onClick={() => handleToggleDriver(driver)}
                                disabled={toggleLoading === driver.id}>
                                {toggleLoading === driver.id
                                  ? t('drivers.actions.loading')
                                  : driver.status === 'active'
                                    ? t('drivers.actions.deactivate')
                                    : t('drivers.actions.activate')}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          {t('drivers.empty')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              {pagination.last_page > 1 && (
                <div className="mt-3">
                  <PaginationComponent
                    currentPage={pagination.current_page}
                    totalPages={pagination.last_page}
                    onPageChange={handlePageChange}
                    totalItems={pagination.total}
                    itemsPerPage={pagination.per_page}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('drivers.deleteModal.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('drivers.deleteModal.body', { name: selectedDriver?.name || '' })}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {t('drivers.actions.cancel')}
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            {t('drivers.actions.delete')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t('drivers.editModal.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t('drivers.fields.name')}</Form.Label>
              <Form.Control type="text" value={editForm.name} onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('drivers.fields.email')}</Form.Label>
              <Form.Control type="email" value={editForm.email} onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('drivers.fields.phone')}</Form.Label>
              <Form.Control type="text" value={editForm.phone} onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('drivers.fields.status')}</Form.Label>
              <Form.Select value={editForm.status} onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}>
                <option value="active">{t('drivers.status.active')}</option>
                <option value="inactive">{t('drivers.status.inactive')}</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('drivers.fields.image')}</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => setEditForm((prev) => ({ ...prev, image: e.target.files?.[0] || null }))} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            {t('drivers.actions.cancel')}
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            {t('drivers.actions.save')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DriversPage
