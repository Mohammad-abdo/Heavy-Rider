import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { Button, Card, Col, Form, Row, Spinner, Table, Modal, Badge } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PageTItle from '@/components/PageTItle'
import TextFormInput from '@/components/form/TextFormInput'
import SelectFormInput from '@/components/form/SelectFormInput'
import PaginationComponent from '@/components/PaginationComponent'
import { ceateCranse, getAllCranse, updateCraneByID, deleteCraneByID, cranesAPI, getSingleCraneById } from '@/api/api'
import { useNotificationContext } from '@/context/useNotificationContext'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useTranslation } from 'react-i18next'
import { getImageUrl } from '@/utils/image-url'

const craneTypeOptions = [
  { value: '', labelKey: 'All Types' },
  { value: 'light-truck', labelKey: 'Light Truck' },
  { value: 'refrigrated', labelKey: 'Refrigerated' },
  { value: 'large-freight', labelKey: 'Large Freight' },
  { value: 'tanker-truck', labelKey: 'Tanker Truck' },
]

const defaultFilters = {
  type: '',
  min_capacity: '',
  max_capacity: '',
  license_plate: '',
  status: '',
  is_online: '',
  min_rating: '',
}

const buildCreateSchema = (t) =>
  yup.object({
    type: yup.string().required(t('Please select crane type')),
    capacity: yup.number().required(t('Please enter capacity')).min(0, t('Capacity must be positive')),
    license_plate: yup.string().required(t('Please enter license plate')).max(50, t('License plate must be max 50 characters')),
    image: yup.mixed().nullable(),
  })

const buildUpdateSchema = (t) =>
  yup.object({
    type: yup.string().nullable(),
    capacity: yup.number().nullable().min(0, t('Capacity must be positive')),
    license_plate: yup.string().nullable().max(50, t('License plate must be max 50 characters')),
    image: yup.mixed().nullable(),
  })

const extractList = (payload) => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.items)) return payload.items
  if (payload.meta && Array.isArray(payload.meta.data)) return payload.meta.data
  return []
}

const CranesPage = () => {
  const { t } = useTranslation()
  const { showNotification } = useNotificationContext()
  const [filters, setFilters] = useState(defaultFilters)
  const [loading, setLoading] = useState(false)
  const [cranes, setCranes] = useState([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  })
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' | 'edit'
  const [selectedCrane, setSelectedCrane] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { control: filterControl, handleSubmit: handleFilterSubmit, reset: resetFilters } = useForm({ defaultValues: defaultFilters })

  const createSchema = useMemo(() => buildCreateSchema(t), [t])
  const updateSchema = useMemo(() => buildUpdateSchema(t), [t])
  const translatedCraneTypeOptions = useMemo(
    () =>
      craneTypeOptions.map((option) => ({
        ...option,
        label: t(option.labelKey),
      })),
    [t],
  )
  const statusOptions = useMemo(
    () => [
      { value: '', label: t('All Status') },
      { value: 'available', label: t('Available') },
      { value: 'in_progress', label: t('In Progress') },
    ],
    [t],
  )
  const onlineStatusOptions = useMemo(
    () => [
      { value: '', label: t('All') },
      { value: '1', label: t('Online') },
      { value: '0', label: t('Offline') },
    ],
    [t],
  )

  const {
    control: formControl,
    handleSubmit: handleFormSubmitWrapper,
    reset: resetForm,
    setValue: setFormValue,
  } = useForm({
    resolver: yupResolver(modalMode === 'create' ? createSchema : updateSchema),
    defaultValues: { type: '', capacity: '', license_plate: '', image: null },
  })

  const fetchCranes = useCallback(
    async (paramsToUse, page = 1) => {
      if (loading) return

      setLoading(true)
      try {
        const params = { ...paramsToUse, page, per_page: pagination.per_page }
        // Only add non-empty filters
        if (params.type === '') delete params.type
        if (!params.min_capacity) delete params.min_capacity
        if (!params.max_capacity) delete params.max_capacity
        if (!params.license_plate) delete params.license_plate
        if (params.status === '') delete params.status
        if (params.is_online === '') delete params.is_online
        if (!params.min_rating) delete params.min_rating

        const response = await getAllCranse(params)

        // Handle paginated response
        if (response?.meta) {
          setPagination({
            current_page: response.meta.current_page || page,
            last_page: response.meta.last_page || 1,
            per_page: response.meta.per_page || pagination.per_page,
            total: response.meta.total || 0,
          })
          setCranes(extractList(response.data || []))
        } else {
          const items = extractList(response?.data ?? response)
          setCranes(items)
          setPagination((prev) => ({
            ...prev,
            current_page: page,
            total: items.length,
            last_page: Math.ceil(items.length / prev.per_page) || 1,
          }))
        }
      } catch (error) {
        const message = error?.response?.data?.message || t('Failed to load cranes')
        showNotification({ variant: 'danger', message })
      } finally {
        setLoading(false)
      }
    },
    [showNotification, loading, pagination.per_page],
  )

  const isMountedRef = useRef(true)
  const isInitialMount = useRef(true)
  const debouncedFilters = useDebounce(filters, 500)
  const debouncedFiltersRef = useRef(debouncedFilters)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    debouncedFiltersRef.current = debouncedFilters
  }, [debouncedFilters])

  useEffect(() => {
    if (isMountedRef.current) {
      if (isInitialMount.current) {
        isInitialMount.current = false
        fetchCranes(defaultFilters, 1)
      } else {
        setPagination((prev) => ({ ...prev, current_page: 1 }))
        fetchCranes(debouncedFilters, 1)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters])

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current_page: page }))
    fetchCranes(debouncedFilters, page)
  }

  const handlePerPageChange = (e) => {
    const perPage = parseInt(e.target.value)
    setPagination((prev) => ({ ...prev, per_page: perPage, current_page: 1 }))
    fetchCranes(debouncedFilters, 1)
  }

  const applyFilters = handleFilterSubmit((values) => {
    setFilters(values)
  })

  const clearFilters = () => {
    resetFilters(defaultFilters)
    setFilters(defaultFilters)
  }

  const handleOpenModal = async (mode, crane = null) => {
    setModalMode(mode)
    if (mode === 'edit' && crane) {
      try {
        // Fetch full crane details
        const response = await getSingleCraneById(crane.id)
        const craneData = response?.data || response || crane

        setSelectedCrane(craneData)
        setFormValue('type', craneData.type || '')
        setFormValue('capacity', craneData.capacity || '')
        setFormValue('license_plate', craneData.license_plate || '')
        setFormValue('image', null) // Reset image, user can upload new one
      } catch (error) {
        // If fetch fails, use the crane data from table
        setSelectedCrane(crane)
        setFormValue('type', crane.type || '')
        setFormValue('capacity', crane.capacity || '')
        setFormValue('license_plate', crane.license_plate || '')
        setFormValue('image', null)
      }
    } else {
      setSelectedCrane(null)
      resetForm({ type: '', capacity: '', license_plate: '', image: null })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedCrane(null)
    resetForm({ type: '', capacity: '', license_plate: '', image: null })
  }

  const handleFormSubmit = handleFormSubmitWrapper(async (values) => {
    setFormLoading(true)
    try {
      const formData = {
        type: values.type,
        capacity: values.capacity,
        license_plate: values.license_plate,
        image: values.image instanceof File ? values.image : null,
      }

      if (modalMode === 'create') {
        await ceateCranse(formData)
        showNotification({ variant: 'success', message: t('Crane created successfully') })
      } else if (modalMode === 'edit' && selectedCrane) {
        await updateCraneByID(selectedCrane.id, formData)
        showNotification({ variant: 'success', message: t('Crane updated successfully') })
      }

      handleCloseModal()
      fetchCranes(debouncedFiltersRef.current, pagination.current_page)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        (modalMode === 'create' ? t('Failed to create crane') : t('Failed to update crane'))
      showNotification({ variant: 'danger', message })
    } finally {
      setFormLoading(false)
    }
  })

  const handleOpenDelete = (crane) => {
    setSelectedCrane(crane)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!selectedCrane) return

    setDeleteLoading(true)
    try {
      await deleteCraneByID(selectedCrane.id)
      showNotification({ variant: 'success', message: t('Crane deleted successfully') })
      setShowDeleteModal(false)
      setSelectedCrane(null)
      fetchCranes(debouncedFiltersRef.current, pagination.current_page)
    } catch (error) {
      const message = error?.response?.data?.message || t('Failed to delete crane')
      showNotification({ variant: 'danger', message })
    } finally {
      setDeleteLoading(false)
    }
  }

  const formatCraneType = (type) => {
    if (!type) return '-'
    return type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <>
      <PageTItle title={t('Cranes')} />
      <Row className="g-4">
        <Col xl={12}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h4 className="card-title mb-0">{t('All Cranes')}</h4>
                <div className="d-flex gap-2 align-items-center">
                  <Form.Select value={pagination.per_page} onChange={handlePerPageChange} style={{ width: '100px' }} size="sm">
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </Form.Select>
                  <Button variant="success" size="sm" onClick={() => handleOpenModal('create')}>
                    <IconifyIcon icon="solar:add-bold" className="me-1" /> {t('Add Crane')}
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => fetchCranes(debouncedFiltersRef.current, pagination.current_page)}
                    disabled={loading}>
                    <IconifyIcon icon="solar:refresh-bold" className="me-1" /> {t('Refresh')}
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <form className="mb-4" onSubmit={applyFilters}>
                <Row className="g-3 align-items-end">
                  <Col lg={3} md={6}>
                    <SelectFormInput control={filterControl} name="type" label={t('Type')} options={translatedCraneTypeOptions} />
                  </Col>
                  <Col lg={3} md={6}>
                    <TextFormInput control={filterControl} name="min_capacity" type="number" label={t('Min Capacity')} placeholder="500" />
                  </Col>
                  <Col lg={3} md={6}>
                    <TextFormInput control={filterControl} name="max_capacity" type="number" label={t('Max Capacity')} placeholder="1000" />
                  </Col>
                  <Col lg={3} md={6}>
                    <TextFormInput control={filterControl} name="license_plate" label={t('License Plate')} placeholder="ABC 123" />
                  </Col>
                  <Col lg={3} md={6}>
                    <SelectFormInput
                      control={filterControl}
                      name="status"
                      label={t('Status')}
                      options={statusOptions}
                    />
                  </Col>
                  <Col lg={3} md={6}>
                    <SelectFormInput
                      control={filterControl}
                      name="is_online"
                      label={t('Online Status')}
                      options={onlineStatusOptions}
                    />
                  </Col>
                  <Col lg={3} md={6}>
                    <TextFormInput control={filterControl} name="min_rating" type="number" label={t('Min Rating')} placeholder="4" step="0.1" />
                  </Col>
                  <Col md={12} className="d-flex gap-2">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {t('Apply Filters')}
                    </Button>
                    <Button type="button" variant="outline-secondary" onClick={clearFilters} disabled={loading}>
                      {t('Reset')}
                    </Button>
                  </Col>
                </Row>
              </form>
              <div className="table-responsive">
                <Table striped hover responsive className="mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>{t('ID')}</th>
                      <th>{t('Image')}</th>
                      <th>{t('Type')}</th>
                      <th>{t('Capacity')}</th>
                      <th>{t('License Plate')}</th>
                      <th>{t('Status')}</th>
                      <th>{t('Online')}</th>
                      <th>{t('Rating')}</th>
                      <th>{t('Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={9} className="text-center py-4">
                          <Spinner animation="border" role="status" size="sm" className="me-2" /> {t('Loading cranes...')}
                        </td>
                      </tr>
                    ) : cranes.length ? (
                      cranes.map((item, idx) => (
                        <tr key={item?.id ?? idx}>
                          <td>{item?.id ?? '-'}</td>
                          <td>
                            {item?.image ? (
                              <img
                                src={getImageUrl(item.image)}
                                alt={t('Crane image')}
                                className="rounded"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  e.target.nextSibling.style.display = 'inline-block'
                                }}
                              />
                            ) : null}
                            <IconifyIcon
                              icon="solar:truck-bold-duotone"
                              className="text-muted"
                              style={{ width: '50px', height: '50px', display: item?.image ? 'none' : 'inline-block' }}
                            />
                          </td>
                          <td className="text-capitalize">{formatCraneType(item?.type) ?? '-'}</td>
                          <td>{item?.capacity ? `${item.capacity} kg` : '-'}</td>
                          <td>{item?.license_plate ?? '-'}</td>
                          <td>
                            {item?.status ? (
                              <Badge bg={item.status === 'available' ? 'success' : 'warning'}>
                                {item.status === 'available' ? t('Available') : t('In Progress')}
                              </Badge>
                            ) : (
                              <Badge bg="secondary">{t('Unknown')}</Badge>
                            )}
                          </td>
                          <td>
                            <Badge bg={item?.is_online ? 'success' : 'secondary'}>{item?.is_online ? t('Online') : t('Offline')}</Badge>
                          </td>
                          <td>
                            {item?.rating ? (
                              <div className="d-flex align-items-center gap-1">
                                <IconifyIcon icon="solar:star-bold" className="text-warning" />
                                <span>{Number(item.rating).toFixed(1)}</span>
                              </div>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button size="sm" variant="outline-primary" onClick={() => handleOpenModal('edit', item)}>
                                <IconifyIcon icon="solar:pen-2-bold" className="me-1" /> {t('Edit')}
                              </Button>
                              <Button size="sm" variant="outline-danger" onClick={() => handleOpenDelete(item)}>
                                <IconifyIcon icon="solar:trash-bin-minimalistic-bold" className="me-1" /> {t('Delete')}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="text-center py-4">
                          {t('No cranes found.')}
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

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'create' ? t('Create Crane') : t('Edit Crane')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleFormSubmit}>
            <Row>
              <Col md={6}>
                <SelectFormInput
                  control={formControl}
                  name="type"
                  label={t('Type')}
                  options={translatedCraneTypeOptions.filter((item) => item.value)}
                  containerClassName="mb-3"
                  required={modalMode === 'create'}
                />
              </Col>
              <Col md={6}>
                <TextFormInput
                  control={formControl}
                  name="capacity"
                  type="number"
                  containerClassName="mb-3"
                  label={t('Capacity (kg)')}
                  placeholder="500"
                  required={modalMode === 'create'}
                />
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <TextFormInput
                  control={formControl}
                  name="license_plate"
                  containerClassName="mb-3"
                  label={t('License Plate')}
                  placeholder="ABC 123"
                  required={modalMode === 'create'}
                />
              </Col>
            </Row>
            <Controller
              control={formControl}
              name="image"
              render={({ field, fieldState }) => (
                <Form.Group className="mb-3">
                  <Form.Label>
                    {t('Image')} {modalMode === 'edit' && t('(Leave empty to keep current image)')}
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(event) => field.onChange(event.target.files?.[0] ?? null)}
                    isInvalid={!!fieldState.error}
                  />
                  <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback>
                  {modalMode === 'edit' && selectedCrane?.image && (
                    <div className="mt-2">
                      <small className="text-muted">{t('Current image:')}</small>
                      <img
                        src={getImageUrl(selectedCrane.image)}
                        alt={t('Current image')}
                        className="d-block mt-1 rounded"
                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </Form.Group>
              )}
            />
            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal} disabled={formLoading}>
                {t('Cancel')}
              </Button>
              <Button type="submit" variant="primary" disabled={formLoading}>
                {formLoading
                  ? t('Saving...')
                  : modalMode === 'create'
                    ? t('Create Crane')
                    : t('Update Crane')}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('Delete Crane')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('Are you sure you want to delete crane #{{id}}?', { id: selectedCrane?.id ?? '' })}</p>
          {selectedCrane?.license_plate && (
            <p className="text-muted">
              {t('License Plate')}: <strong>{selectedCrane.license_plate}</strong>
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>
            {t('Cancel')}
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? t('Deleting...') : t('Delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CranesPage
