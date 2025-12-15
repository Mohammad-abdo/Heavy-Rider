import { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { getSettings, updateSettings } from '@/api/api'
import { useNotificationContext } from '@/context/useNotificationContext'

const AppSettings = () => {
  const { showNotification } = useNotificationContext()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState([])
  const [formData, setFormData] = useState({
    minimum_fare_to_ride: '',
    profit_type: 'percentage',
    profit_value: '',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await getSettings() // response is array of objects
      const data = response?.data || []
      setSettings(data)

      // Map array to formData
      const formMapped = {}
      data.forEach((item) => {
        formMapped[item.setting_key] = item.setting_value
      })
      setFormData({
        minimum_fare_to_ride: formMapped.minimum_fare_to_ride || '',
        profit_type: formMapped.profit_type || 'percentage',
        profit_value: formMapped.profit_value || '',
      })
    } catch (error) {
      showNotification({ variant: 'danger', message: 'Failed to load settings' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation for percentage
    if (formData.profit_type === 'percentage' && Number(formData.profit_value) > 100) {
      showNotification({ variant: 'warning', message: 'Percentage cannot exceed 100' })
      return
    }

    setSaving(true)
    try {
      // Convert formData back to array format
      const payload = Object.keys(formData).map((key) => ({
        setting_key: key,
        setting_value: formData[key],
      }))

      await updateSettings(payload)
      showNotification({ variant: 'success', message: 'Settings updated successfully' })
      fetchSettings()
    } catch (error) {
      showNotification({ variant: 'danger', message: 'Failed to update settings' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <Row>
      {/* Edit Settings */}
      <Col lg={12}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="d-flex align-items-center gap-1">
              <IconifyIcon icon="solar:settings-bold-duotone" className="text-primary fs-20" />
              Edit Application Settings
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Minimum Fare to Ride</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.minimum_fare_to_ride}
                      onChange={(e) => setFormData({ ...formData, minimum_fare_to_ride: e.target.value })}
                      placeholder="Enter minimum fare"
                    />
                  </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Profit Type</Form.Label>
                    <Form.Select value={formData.profit_type} onChange={(e) => setFormData({ ...formData, profit_type: e.target.value })}>
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Profit Value</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.profit_value}
                      onChange={(e) => setFormData({ ...formData, profit_value: e.target.value })}
                      placeholder={formData.profit_type === 'percentage' ? 'Enter percentage (less than 100)' : 'Enter fixed value'}
                      max={formData.profit_type === 'percentage' ? 100 : undefined}
                    />
                    {formData.profit_type === 'percentage' && <Form.Text className="text-muted">Enter a value less than 100</Form.Text>}
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-end">
                <Button type="submit" variant="success" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>

      {/* Display Current Settings */}
      <Col lg={12}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="d-flex align-items-center gap-1">
              <IconifyIcon icon="solar:settings-bold-duotone" className="text-primary fs-20" />
              Current Settings
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {settings.map((item) => (
                  <tr key={item.setting_key}>
                    <td>{item.setting_key}</td>
                    <td>{item.setting_value}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default AppSettings
