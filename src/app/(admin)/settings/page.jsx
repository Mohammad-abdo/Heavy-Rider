import PageTItle from '@/components/PageTItle'
import CustomersSettings from './components/CustomersSettings'
import GeneralSettings from './components/GeneralSettings'
import LocalizationSettings from './components/LocalizationSettings'
import SettingsBoxs from './components/SettingsBoxs'
import StoreSettings from './components/StoreSettings'
import AppSettings from './components/AppSettings'

const SettingsPage = () => {
  return (
    <>
      <PageTItle title="Settings" />
      <AppSettings />
      {/* <GeneralSettings />
      <StoreSettings />
      <LocalizationSettings />
      <SettingsBoxs />
      <CustomersSettings /> */}
    </>
  )
}

export default SettingsPage
