import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { Button, Card, Col, Form, Row, Spinner, Table, Modal } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import PaginationComponent from '@/components/PaginationComponent'
import { useNotificationContext } from '@/context/useNotificationContext'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import {
  getAllRiders,
  deleteRider as apiDeleteRider,
  updateRider as apiUpdateRider,
  updateRider,
  deleteRider,
  riderToggle,
} from '../../../../api/api'

const RidesPage = () => {
  const { showNotification } = useNotificationContext()
  const [riderFilterState, setRiderFilterState] = useState({ search: '', status: '' })
  const [riderLoading, setRiderLoading] = useState(false)
  const [riderRides, setRiderRides] = useState([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  })

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedRider, setSelectedRider] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', status: 'active', image: null })
  const [toggleLoading, setToggleLoading] = useState(null) // لتحديد أي راكب جاري تغييره

  // Fetch Riders
  const fetchRiderRides = useCallback(async (paramsToUse = {}, page = 1) => {
    if (riderLoading) return // Prevent multiple simultaneous calls
    
    setRiderLoading(true)
    try {
      const params = { ...paramsToUse, page, per_page: pagination.per_page }
      if (!params.search) delete params.search
      if (!params.status) delete params.status

      const response = await getAllRiders(params)
      
      // Handle paginated response
      if (response?.meta) {
        setPagination({
          current_page: response.meta.current_page || page,
          last_page: response.meta.last_page || 1,
          per_page: response.meta.per_page || pagination.per_page,
          total: response.meta.total || 0,
        })
        setRiderRides(response.data || [])
      } else {
        const items = response || []
        setRiderRides(items)
        setPagination((prev) => ({
          ...prev,
          current_page: page,
          total: items.length,
          last_page: Math.ceil(items.length / prev.per_page) || 1,
        }))
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load riders'
      showNotification({ variant: 'danger', message })
    } finally {
      setRiderLoading(false)
    }
  }, [showNotification, riderLoading, pagination.per_page])

  const isMountedRef = useRef(true)
  const isInitialMount = useRef(true)
  const debouncedFilters = useDebounce(riderFilterState, 500)
  
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (isMountedRef.current) {
      if (isInitialMount.current) {
        isInitialMount.current = false
        fetchRiderRides({}, 1)
      } else {
        setPagination((prev) => ({ ...prev, current_page: 1 }))
        fetchRiderRides(debouncedFilters, 1)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters])

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current_page: page }))
    fetchRiderRides(debouncedFilters, page)
  }

  const handlePerPageChange = (e) => {
    const perPage = parseInt(e.target.value)
    setPagination((prev) => ({ ...prev, per_page: perPage, current_page: 1 }))
    fetchRiderRides(debouncedFilters, 1)
  }

  // Open Delete Modal
  const handleOpenDelete = (rider) => {
    setSelectedRider(rider)
    setShowDeleteModal(true)
  }

  // Delete Rider
  const handleDelete = async () => {
    try {
      await deleteRider(selectedRider.id)
      showNotification({ variant: 'success', message: 'Rider deleted successfully' })
      fetchRiderRides(debouncedFilters, pagination.current_page)
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to delete rider'
      showNotification({ variant: 'danger', message })
    } finally {
      setShowDeleteModal(false)
    }
  }

  // Open Edit Modal
  const handleOpenEdit = (rider) => {
    setSelectedRider(rider)
    setEditForm({
      name: rider.name || '',
      email: rider.email || '',
      phone: rider.phone || '',
      status: rider.status || 'active',
      image: null,
    })
    setShowEditModal(true)
  }

  // Save Edit
  const handleEditSave = async () => {
    try {
      const res = await updateRider(selectedRider.id, editForm)
      console.log(res)
      showNotification({ variant: 'success', message: 'Rider updated successfully' })
      fetchRiderRides(debouncedFilters, pagination.current_page)
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update rider'
      showNotification({ variant: 'danger', message })
    } finally {
      setShowEditModal(false)
    }
  }
  const handleToggleRider = async (rider) => {
    setToggleLoading(rider.id)
    try {
      await riderToggle(rider.id)
      showNotification({
        variant: 'success',
        message: `Rider ${rider.status === 'active' ? 'deactivated' : 'activated'} successfully`,
      })
      fetchRiderRides(debouncedFilters, pagination.current_page)
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to toggle rider status'
      showNotification({ variant: 'danger', message })
    } finally {
      setToggleLoading(null)
    }
  }

  return (
    <>
      <PageTItle title="Rides" />
      <Row className="g-4">
        <Col xl={12}>
          <Card>
            <Card.Header>
              <h4 className="card-title mb-0">Book a Ride</h4>
            </Card.Header>
            <Card.Body></Card.Body>
          </Card>
        </Col>
        <Col xl={12}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h4 className="card-title mb-0">All Riders</h4>
                <div className="d-flex gap-2 align-items-center">
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={riderFilterState.search}
                    onChange={(e) => setRiderFilterState({ ...riderFilterState, search: e.target.value })}
                    style={{ width: '200px' }}
                  />
                  <Form.Select
                    value={riderFilterState.status}
                    onChange={(e) => setRiderFilterState({ ...riderFilterState, status: e.target.value })}
                    style={{ width: '150px' }}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                  <Form.Select value={pagination.per_page} onChange={handlePerPageChange} style={{ width: '100px' }} size="sm">
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </Form.Select>
                  <Button variant="light" size="sm" onClick={() => fetchRiderRides(debouncedFilters, pagination.current_page)} disabled={riderLoading}>
                    <IconifyIcon icon="solar:refresh-bold" className="me-1" /> Refresh
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover responsive className="mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>ID</th>
                      <th>image</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>phone verified</th>
                      <th>Wallet Balance</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riderLoading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          <Spinner animation="border" size="sm" className="me-2" /> Loading riders...
                        </td>
                      </tr>
                    ) : riderRides.length ? (
                      riderRides.map((rider, idx) => (
                        <tr key={rider?.id ?? idx}>
                          <td>{rider?.id ?? '-'}</td>
                          <td>
                            <img src={rider?.image ?? ''} className="avatar avatar-sm rounded-circle me-2" alt="" />{' '}
                            <span className="fw-medium">{rider?.username ?? '-'}</span>
                          </td>
                          <td>{rider?.name ?? '-'}</td>
                          <td>{rider?.email ?? '-'}</td>
                          <td>{rider?.phone ?? '-'}</td>
                          <td>
                            <span className={`badge ${rider?.status === 'active' ? 'bg-success' : 'bg-danger'}`}>{rider?.status ?? '-'}</span>
                          </td>
                          <td>{rider?.is_phone_verified ? 'Yes' : 'No'}</td>
                          <td>{rider?.wallet?.balance ?? '0.00'}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button size="sm" variant="outline-primary" onClick={() => handleOpenEdit(rider)}>
                                Edit
                              </Button>
                              <Button size="sm" variant="outline-danger" onClick={() => handleOpenDelete(rider)}>
                                Delete
                              </Button>
                              <Button
                                size="sm"
                                variant={rider.status === 'active' ? 'outline-secondary' : 'outline-success'}
                                onClick={() => handleToggleRider(rider)}
                                disabled={toggleLoading === rider.id}>
                                {toggleLoading === rider.id ? 'Loading...' : rider.status === 'active' ? 'Deactivate' : 'Activate'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          No riders found.
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
          <Modal.Title>Delete Rider</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedRider?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Rider</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={editForm.name} onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={editForm.email} onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" value={editForm.phone} onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select value={editForm.status} onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setEditForm((prev) => ({ ...prev, image: e.target.files?.[0] || null }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default RidesPage
