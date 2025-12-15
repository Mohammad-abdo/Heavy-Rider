import { useCallback, useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row, Spinner, Table, Modal, Badge } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { useNotificationContext } from '@/context/useNotificationContext'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { transactionsAPI } from '@/api/api'

const TransactionsPage = () => {
  const { showNotification } = useNotificationContext()
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [withdrawRequests, setWithdrawRequests] = useState([])
  const [filters, setFilters] = useState({ type: '', status: '' })
  const [withdrawStatusFilter, setWithdrawStatusFilter] = useState('')
  const [showChargeModal, setShowChargeModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [chargeAmount, setChargeAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Fetch Transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.type) params.type = filters.type
      if (filters.status) params.status = filters.status

      const response = await transactionsAPI.getMyTransactions(params)
      setTransactions(response?.data || response || [])
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load transactions'
      showNotification({ variant: 'danger', message })
    } finally {
      setLoading(false)
    }
  }, [filters, showNotification])

  // Fetch Withdraw Requests
  const fetchWithdrawRequests = useCallback(async () => {
    try {
      const params = {}
      if (withdrawStatusFilter) params.status = withdrawStatusFilter

      const response = await transactionsAPI.getMyWithdrawRequests(params)
      setWithdrawRequests(response?.data || response || [])
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load withdraw requests'
      showNotification({ variant: 'danger', message })
    }
  }, [withdrawStatusFilter, showNotification])

  useEffect(() => {
    fetchTransactions()
    fetchWithdrawRequests()
  }, [fetchTransactions, fetchWithdrawRequests])

  // Handle Charge Wallet
  const handleChargeWallet = async () => {
    if (!chargeAmount || parseFloat(chargeAmount) <= 0) {
      showNotification({ variant: 'danger', message: 'Please enter a valid amount' })
      return
    }

    setSubmitting(true)
    try {
      await transactionsAPI.chargeMyWallet(chargeAmount)
      showNotification({ variant: 'success', message: 'Wallet charged successfully' })
      setShowChargeModal(false)
      setChargeAmount('')
      fetchTransactions()
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to charge wallet'
      showNotification({ variant: 'danger', message })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Add Withdraw Request
  const handleAddWithdrawRequest = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      showNotification({ variant: 'danger', message: 'Please enter a valid amount' })
      return
    }

    setSubmitting(true)
    try {
      await transactionsAPI.addWithdrawRequest(withdrawAmount)
      showNotification({ variant: 'success', message: 'Withdraw request added successfully' })
      setShowWithdrawModal(false)
      setWithdrawAmount('')
      fetchWithdrawRequests()
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to add withdraw request'
      showNotification({ variant: 'danger', message })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: 'success',
      pending: 'warning',
      failed: 'danger',
    }
    return <Badge bg={statusMap[status] || 'secondary'}>{status || 'N/A'}</Badge>
  }

  const getTypeBadge = (type) => {
    const typeMap = {
      deposit: 'success',
      withdraw: 'danger',
    }
    return <Badge bg={typeMap[type] || 'secondary'}>{type || 'N/A'}</Badge>
  }

  return (
    <>
      <PageTItle title="Transactions" />
      <Row className="g-4">
        {/* Charge Wallet & Withdraw Actions */}
        <Col xl={12}>
          <Card>
            <Card.Header>
              <h4 className="card-title mb-0">Wallet Actions</h4>
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-2">
                <Button variant="success" onClick={() => setShowChargeModal(true)}>
                  <IconifyIcon icon="solar:wallet-money-bold-duotone" className="me-1" /> Charge Wallet
                </Button>
                <Button variant="primary" onClick={() => setShowWithdrawModal(true)}>
                  <IconifyIcon icon="solar:card-send-bold-duotone" className="me-1" /> Request Withdraw
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Transactions Table */}
        <Col xl={12}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">My Transactions</h4>
                <div className="d-flex gap-2">
                  <Form.Select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    style={{ width: '150px' }}>
                    <option value="">All Types</option>
                    <option value="deposit">Deposit</option>
                    <option value="withdraw">Withdraw</option>
                  </Form.Select>
                  <Form.Select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    style={{ width: '150px' }}>
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </Form.Select>
                  <Button variant="light" size="sm" onClick={fetchTransactions} disabled={loading}>
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
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          <Spinner animation="border" size="sm" className="me-2" /> Loading transactions...
                        </td>
                      </tr>
                    ) : transactions.length ? (
                      transactions.map((transaction, idx) => (
                        <tr key={transaction?.id ?? idx}>
                          <td>{transaction?.id ?? '-'}</td>
                          <td>{getTypeBadge(transaction?.type)}</td>
                          <td className="fw-medium">{transaction?.amount ?? '0.00'}</td>
                          <td>{getStatusBadge(transaction?.status)}</td>
                          <td>
                            {transaction?.created_at
                              ? new Date(transaction.created_at).toLocaleDateString('en-US', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '-'}
                          </td>
                          <td>{transaction?.description || transaction?.note || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          No transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Withdraw Requests Table */}
        <Col xl={12}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">My Withdraw Requests</h4>
                <div className="d-flex gap-2">
                  <Form.Select
                    value={withdrawStatusFilter}
                    onChange={(e) => setWithdrawStatusFilter(e.target.value)}
                    style={{ width: '150px' }}>
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </Form.Select>
                  <Button variant="light" size="sm" onClick={fetchWithdrawRequests} disabled={loading}>
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
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Request Date</th>
                      <th>Completed Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          <Spinner animation="border" size="sm" className="me-2" /> Loading withdraw requests...
                        </td>
                      </tr>
                    ) : withdrawRequests.length ? (
                      withdrawRequests.map((request, idx) => (
                        <tr key={request?.id ?? idx}>
                          <td>{request?.id ?? '-'}</td>
                          <td className="fw-medium">{request?.amount ?? '0.00'}</td>
                          <td>{getStatusBadge(request?.status)}</td>
                          <td>
                            {request?.created_at
                              ? new Date(request.created_at).toLocaleDateString('en-US', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '-'}
                          </td>
                          <td>
                            {request?.completed_at
                              ? new Date(request.completed_at).toLocaleDateString('en-US', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          No withdraw requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charge Wallet Modal */}
      <Modal show={showChargeModal} onHide={() => setShowChargeModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Charge Wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={chargeAmount}
              onChange={(e) => setChargeAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
            <Form.Text className="text-muted">This is for testing only. In production, you will be redirected to payment gateway.</Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChargeModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleChargeWallet} disabled={submitting}>
            {submitting ? 'Processing...' : 'Charge Wallet'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Withdraw Request Modal */}
      <Modal show={showWithdrawModal} onHide={() => setShowWithdrawModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Withdraw Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWithdrawModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddWithdrawRequest} disabled={submitting}>
            {submitting ? 'Processing...' : 'Submit Request'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default TransactionsPage



