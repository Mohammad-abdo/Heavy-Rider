import { useState, useEffect } from 'react'
import { Row, Col, Tabs, Tab, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import AnimatedDataTable from './AnimatedDataTable'
import { getAllRiders, getAllDrivers, getAllCranse, getAllAdmins } from '@/api/api'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Badge } from 'react-bootstrap'

const DashboardDataTables = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('riders')
  const [riders, setRiders] = useState([])
  const [drivers, setDrivers] = useState([])
  const [cranes, setCranes] = useState([])
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState({
    riders: false,
    drivers: false,
    cranes: false,
    admins: false,
  })

  const extractData = (response) => {
    if (!response) return []
    if (Array.isArray(response)) return response
    if (response?.data) {
      if (Array.isArray(response.data)) return response.data
      if (response.data?.data && Array.isArray(response.data.data)) return response.data.data
    }
    return []
  }

  const loadRiders = async () => {
    setLoading((prev) => ({ ...prev, riders: true }))
    try {
      const data = await getAllRiders()
      setRiders(extractData(data))
    } catch (error) {
      console.error('Failed to load riders:', error)
      setRiders([])
    } finally {
      setLoading((prev) => ({ ...prev, riders: false }))
    }
  }

  const loadDrivers = async () => {
    setLoading((prev) => ({ ...prev, drivers: true }))
    try {
      const data = await getAllDrivers()
      setDrivers(extractData(data))
    } catch (error) {
      console.error('Failed to load drivers:', error)
      setDrivers([])
    } finally {
      setLoading((prev) => ({ ...prev, drivers: false }))
    }
  }

  const loadCranes = async () => {
    setLoading((prev) => ({ ...prev, cranes: true }))
    try {
      const data = await getAllCranse()
      setCranes(extractData(data))
    } catch (error) {
      console.error('Failed to load cranes:', error)
      setCranes([])
    } finally {
      setLoading((prev) => ({ ...prev, cranes: false }))
    }
  }

  const loadAdmins = async () => {
    setLoading((prev) => ({ ...prev, admins: true }))
    try {
      const data = await getAllAdmins()
      setAdmins(extractData(data))
    } catch (error) {
      console.error('Failed to load admins:', error)
      setAdmins([])
    } finally {
      setLoading((prev) => ({ ...prev, admins: false }))
    }
  }

  const refreshCurrentTab = () => {
    if (activeTab === 'riders') loadRiders()
    if (activeTab === 'drivers') loadDrivers()
    if (activeTab === 'cranes') loadCranes()
    if (activeTab === 'admins') loadAdmins()
  }

  useEffect(() => {
    refreshCurrentTab()
  }, [activeTab])

  const ridersColumns = [
    {
      key: 'image',
      label: t('Image'),
      type: 'image',
    },
    {
      key: 'name',
      label: t('Name'),
      sortable: true,
    },
    {
      key: 'email',
      label: t('Email'),
      sortable: true,
    },
    {
      key: 'phone_number',
      label: t('Phone'),
    },
    {
      key: 'status',
      label: t('Status'),
      type: 'badge',
      badgeVariant: (value) => {
        const status = String(value).toLowerCase()
        return status === 'active' ? 'success' : 'secondary'
      },
    },
    {
      key: 'created_at',
      label: t('Created At'),
      type: 'date',
    },
  ]

  const driversColumns = [
    {
      key: 'image',
      label: t('Image'),
      type: 'image',
    },
    {
      key: 'name',
      label: t('Name'),
      sortable: true,
    },
    {
      key: 'email',
      label: t('Email'),
      sortable: true,
    },
    {
      key: 'phone_number',
      label: t('Phone'),
    },
    {
      key: 'status',
      label: t('Status'),
      type: 'badge',
      badgeVariant: (value) => {
        const status = String(value).toLowerCase()
        return status === 'active' ? 'success' : 'secondary'
      },
    },
    {
      key: 'created_at',
      label: t('Created At'),
      type: 'date',
    },
  ]

  const cranesColumns = [
    {
      key: 'image',
      label: t('Image'),
      type: 'image',
    },
    {
      key: 'type',
      label: t('Type'),
      sortable: true,
      format: (value) => {
        const typeMap = {
          'light-truck': t('Light Truck'),
          refrigrated: t('Refrigerated'),
          'large-freight': t('Large Freight'),
          'tanker-truck': t('Tanker Truck'),
        }
        return typeMap[value] || value
      },
    },
    {
      key: 'license_plate',
      label: t('License Plate'),
      sortable: true,
    },
    {
      key: 'capacity',
      label: t('Capacity'),
      sortable: true,
      format: (value) => `${value} ${t('kg')}`,
    },
    {
      key: 'status',
      label: t('Status'),
      type: 'badge',
      badgeVariant: (value) => {
        const status = String(value).toLowerCase()
        if (status === 'available') return 'success'
        if (status === 'in_progress' || status === 'in-progress') return 'warning'
        return 'secondary'
      },
    },
    {
      key: 'is_online',
      label: t('Online'),
      format: (value) => (
        <Badge bg={value === 1 || value === true ? 'success' : 'secondary'}>
          {value === 1 || value === true ? t('Yes') : t('No')}
        </Badge>
      ),
    },
  ]

  const adminsColumns = [
    {
      key: 'image',
      label: t('Image'),
      type: 'image',
    },
    {
      key: 'name',
      label: t('Name'),
      sortable: true,
    },
    {
      key: 'email',
      label: t('Email'),
      sortable: true,
    },
    {
      key: 'phone',
      label: t('Phone'),
    },
    {
      key: 'status',
      label: t('Status'),
      type: 'badge',
      badgeVariant: (value) => {
        const status = String(value).toLowerCase()
        return status === 'active' ? 'success' : 'secondary'
      },
    },
    {
      key: 'permissions',
      label: t('Permissions'),
      accessor: (row) => {
        if (Array.isArray(row.permissions)) {
          return row.permissions.length > 0 ? (
            <Badge bg="info">{row.permissions.length} {t('permissions')}</Badge>
          ) : (
            '—'
          )
        }
        return '—'
      },
    },
  ]

  return (
    <div className="animated-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{t('Data Management')}</h5>
        <Button variant="light" size="sm" onClick={refreshCurrentTab} disabled={loading[activeTab]}>
          <IconifyIcon icon="solar:refresh-bold" className="me-2" />
          {t('Refresh')}
        </Button>
      </div>
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
        fill
      >
        <Tab
          eventKey="riders"
          title={
            <span className="d-flex align-items-center gap-2">
              <IconifyIcon icon="solar:user-bold-duotone" />
              {t('Riders')} ({riders.length})
            </span>
          }
        >
          <AnimatedDataTable
            title={t('All Riders')}
            data={riders}
            columns={ridersColumns}
            loading={loading.riders}
            searchable
            paginated
            pageSize={10}
            emptyMessage={t('No riders found')}
          />
        </Tab>
        <Tab
          eventKey="drivers"
          title={
            <span className="d-flex align-items-center gap-2">
              <IconifyIcon icon="solar:steering-wheel-bold-duotone" />
              {t('Drivers')} ({drivers.length})
            </span>
          }
        >
          <AnimatedDataTable
            title={t('All Drivers')}
            data={drivers}
            columns={driversColumns}
            loading={loading.drivers}
            searchable
            paginated
            pageSize={10}
            emptyMessage={t('No drivers found')}
          />
        </Tab>
        <Tab
          eventKey="cranes"
          title={
            <span className="d-flex align-items-center gap-2">
              <IconifyIcon icon="solar:truck-bold-duotone" />
              {t('Cranes')} ({cranes.length})
            </span>
          }
        >
          <AnimatedDataTable
            title={t('All Cranes')}
            data={cranes}
            columns={cranesColumns}
            loading={loading.cranes}
            searchable
            paginated
            pageSize={10}
            emptyMessage={t('No cranes found')}
          />
        </Tab>
        <Tab
          eventKey="admins"
          title={
            <span className="d-flex align-items-center gap-2">
              <IconifyIcon icon="solar:shield-user-bold-duotone" />
              {t('Admins')} ({admins.length})
            </span>
          }
        >
          <AnimatedDataTable
            title={t('All Admins')}
            data={admins}
            columns={adminsColumns}
            loading={loading.admins}
            searchable
            paginated
            pageSize={10}
            emptyMessage={t('No admins found')}
          />
        </Tab>
      </Tabs>
    </div>
  )
}

export default DashboardDataTables

