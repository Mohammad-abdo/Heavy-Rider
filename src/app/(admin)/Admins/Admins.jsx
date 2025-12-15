import { useEffect, useState, useCallback, useRef } from 'react'
import { Button, Card, Col, Row, Spinner, Table, Modal, Form } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import PaginationComponent from '@/components/PaginationComponent'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useNotificationContext } from '@/context/useNotificationContext'
import { getAllAdmins, createAdmin, updateAdmin, deleteAdmin, toggleAdmin, getAllPermissions } from '../../../api/api'
import { useDebounce } from '@/hooks/useDebounce'
import { useTranslation } from 'react-i18next'

const Admins = () => {
  const { t } = useTranslation()
  const { showNotification } = useNotificationContext()

  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(false)
  const [toggleLoading, setToggleLoading] = useState(null)

  const [permissions, setPermissions] = useState([])

  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' | 'edit'
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', status: 'active', image: null, permissions: [] })

  const [filters, setFilters] = useState({ search: '', status: '' })
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  })
  
  // Fetch Admins
  const fetchAdmins = useCallback(async (paramsToUse = {}, page = 1) => {
    if (loading) return
    
    setLoading(true)
    try {
      const params = { ...paramsToUse, page, per_page: pagination.per_page }
      if (!params.search) delete params.search
      if (!params.status) delete params.status

      const res = await getAllAdmins(params)
      
      // Handle paginated response
      if (res?.meta) {
        setPagination({
          current_page: res.meta.current_page || page,
          last_page: res.meta.last_page || 1,
          per_page: res.meta.per_page || pagination.per_page,
          total: res.meta.total || 0,
        })
        setAdmins(res.data || [])
      } else {
        const items = res?.data || res || []
        setAdmins(items)
        setPagination((prev) => ({
          ...prev,
          current_page: page,
          total: items.length,
          last_page: Math.ceil(items.length / prev.per_page) || 1,
        }))
      }
    } catch (error) {
      showNotification({ variant: 'danger', message: t('admins.notifications.fetchFailed') })
    } finally {
      setLoading(false)
    }
  }, [showNotification, loading, pagination.per_page])

  // Fetch Permissions
  const fetchPermissions = useCallback(async () => {
    try {
      const res = await getAllPermissions()
      console.log(res)
      setPermissions(res?.permissions || []) // <--- استخدم المفتاح permissions
    } catch (error) {
      console.log(error)
    }
  }, [])

  const isInitialMount = useRef(true)
  const debouncedFilters = useDebounce(filters, 500)

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      fetchAdmins({}, 1)
    } else {
      setPagination((prev) => ({ ...prev, current_page: 1 }))
      fetchAdmins(debouncedFilters, 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters])

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current_page: page }))
    fetchAdmins(debouncedFilters, page)
  }

  const handlePerPageChange = (e) => {
    const perPage = parseInt(e.target.value)
    setPagination((prev) => ({ ...prev, per_page: perPage, current_page: 1 }))
    fetchAdmins(debouncedFilters, 1)
  }

  // Open Modal
  const handleOpenModal = (mode, admin = null) => {
    setModalMode(mode)
    if (mode === 'edit' && admin) {
      setSelectedAdmin(admin)
      setForm({
        name: admin.name || '',
        email: admin.email || '',
        phone: admin.phone || '',
        password: '',
        status: admin.status || 'active',
        image: null,
        permissions: admin.permissions || [],
      })
    } else {
      setForm({ name: '', email: '', phone: '', password: '', status: 'active', image: null, permissions: [] })
    }
    setShowModal(true)
  }

  // Save Admin (Create or Edit)
  const handleSaveAdmin = async () => {
    try {
      if (modalMode === 'create') {
        await createAdmin(form)
        showNotification({ variant: 'success', message: t('admins.notifications.createSuccess') })
      } else if (modalMode === 'edit') {
        await updateAdmin(selectedAdmin.id, form)
        showNotification({ variant: 'success', message: t('admins.notifications.updateSuccess') })
      }
      fetchAdmins(debouncedFilters, pagination.current_page)
    } catch (error) {
      showNotification({ variant: 'danger', message: t('admins.notifications.saveFailed') })
    } finally {
      setShowModal(false)
    }
  }

  // Delete Admin
  const handleDeleteAdmin = async (admin) => {
    if (!confirm(t('admins.deleteConfirm', { name: admin.name || '' }))) return
    try {
      await deleteAdmin(admin.id)
      showNotification({ variant: 'success', message: t('admins.notifications.deleteSuccess') })
      fetchAdmins(debouncedFilters, pagination.current_page)
    } catch (error) {
      showNotification({ variant: 'danger', message: t('admins.notifications.deleteFailed') })
    }
  }

  // Toggle Admin Status
  const handleToggleAdmin = async (admin) => {
    setToggleLoading(admin.id)
    try {
      const res = await toggleAdmin(admin.id)
      console.log(res)

      showNotification({
        variant: 'success',
        message: admin.status === 'active' ? t('admins.notifications.deactivated') : t('admins.notifications.activated'),
      })
      fetchAdmins(debouncedFilters, pagination.current_page)
    } catch (error) {
      showNotification({ variant: 'danger', message: t('admins.notifications.toggleFailed') })
    } finally {
      setToggleLoading(null)
    }
  }

  return (
    <>
      <PageTItle title={t('admins.pageTitle')} />
      <Row className="g-4">
        <Col xl={12}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h4 className="card-title mb-0">{t('admins.listTitle')}</h4>
                <div className="d-flex gap-2 align-items-center">
                  <Form.Control
                    type="text"
                    placeholder={t('admins.searchPlaceholder')}
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    style={{ width: '200px' }}
                  />
                  <Form.Select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    style={{ width: '150px' }}>
                    <option value="">{t('admins.filters.allStatus')}</option>
                    <option value="active">{t('admins.status.active')}</option>
                    <option value="inactive">{t('admins.status.inactive')}</option>
                  </Form.Select>
                  <Form.Select value={pagination.per_page} onChange={handlePerPageChange} style={{ width: '100px' }} size="sm">
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </Form.Select>
                  <Button variant="success" size="sm" onClick={() => handleOpenModal('create')}>
                    <IconifyIcon icon="solar:add-bold" className="me-1" /> {t('admins.actions.add')}
                  </Button>
                  <Button variant="light" size="sm" onClick={() => fetchAdmins(debouncedFilters, pagination.current_page)} disabled={loading}>
                    <IconifyIcon icon="solar:refresh-bold" className="me-1" />
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table striped hover responsive className="mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>{t('admins.table.id')}</th>
                      <th>{t('admins.table.name')}</th>
                      <th>{t('admins.table.email')}</th>
                      <th>{t('admins.table.phone')}</th>
                      <th>{t('admins.table.image')}</th>
                      <th>{t('admins.table.status')}</th>
                      <th>{t('admins.table.permissions')}</th>
                      <th>{t('admins.table.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          <Spinner animation="border" size="sm" className="me-2" /> {t('admins.loading')}
                        </td>
                      </tr>
                    ) : admins.length ? (
                      admins.map((admin) => (
                        <tr key={admin.id}>
                          <td>{admin.id}</td>
                          <td className="text-capitalize">{admin.name}</td>
                          <td>{admin.email}</td>
                          <td>{admin.phone}</td>
                          <td>
                            <img src={admin.image} alt="" className="avatar" />
                          </td>
                          <td>
                            <span className={`badge ${admin.status === 'active ' ? 'bg-success' : 'bg-secondary'}`}>
                              {admin.status ? t('admins.status.active') : t('admins.status.inactive')}
                            </span>
                          </td>
                          <td>
                            {admin?.permissions.map((p) => (
                              <span key={p} className="badge bg-warning text-dark me-1 text-capitalize">
                                {p}
                              </span>
                            ))}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button size="sm" variant="outline-primary" onClick={() => handleOpenModal('edit', admin)}>
                                {t('admins.actions.edit')}
                              </Button>
                              <Button
                                size="sm"
                                variant={admin.status === 'active' ? 'outline-secondary' : 'outline-success'}
                                onClick={() => handleToggleAdmin(admin)}
                                disabled={toggleLoading === admin.id}>
                                {toggleLoading === admin.id
                                  ? t('admins.actions.loading')
                                  : admin.status === 'active'
                                    ? t('admins.actions.deactivate')
                                    : t('admins.actions.activate')}
                              </Button>
                              <Button size="sm" variant="outline-danger" onClick={() => handleDeleteAdmin(admin)}>
                                {t('admins.actions.delete')}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          {t('admins.empty')}
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

      {/* Modal for Create/Edit Admin */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'create' ? t('admins.modal.createTitle') : t('admins.modal.editTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>{t('admins.fields.name')}</Form.Label>
                  <Form.Control type="text" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>{t('admins.fields.email')}</Form.Label>
                  <Form.Control type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>{t('admins.fields.phone')}</Form.Label>
                  <Form.Control type="text" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>{t('admins.fields.status')}</Form.Label>
                  <Form.Select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                    <option value="active">{t('admins.status.active')}</option>
                    <option value="inactive">{t('admins.status.inactive')}</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            {modalMode === 'create' && (
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>{t('admins.fields.password')}</Form.Label>
                    <Form.Control
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder={t('admins.placeholders.password')}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Form.Group className="mb-3">
              <Form.Label>{t('admins.fields.permissions')}</Form.Label>
              <div
                style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  border: '1px solid #ced4da',
                  borderRadius: '0.25rem',
                  padding: '0.5rem',
                  display: 'flex',
                  gap: '0.5rem',
                }}>
                {permissions?.map((p) => (
                  <Form.Check
                    key={p}
                    type="checkbox"
                    id={`perm-${p}`}
                    label={p}
                    checked={form.permissions.includes(p)}
                    onChange={(e) => {
                      const isChecked = e.target.checked
                      setForm((prev) => ({
                        ...prev,
                        permissions: isChecked ? [...prev.permissions, p] : prev.permissions.filter((perm) => perm !== p),
                      }))
                    }}
                    className="text-capitalize mb-1"
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('admins.fields.image')}</Form.Label>
              <Form.Control type="file" onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.files[0] }))} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('admins.actions.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSaveAdmin}>
            {modalMode === 'create' ? t('admins.actions.create') : t('admins.actions.save')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Admins
