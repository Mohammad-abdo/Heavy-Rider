import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import ActivityStreamToggle from './components/ActivityStreamToggle'
import LanguageDropdown from './components/LanguageDropdown'
import LeftSideBarToggle from './components/LeftSideBarToggle'
import Notifications from './components/Notifications'
import ProfileDropdown from './components/ProfileDropdown'
import ThemeCustomizerToggle from './components/ThemeCustomizerToggle'
import ThemeModeToggle from './components/ThemeModeToggle'
import TopBarTitle from './components/TopBarTitle'
const page = () => {
  const { t } = useTranslation()
  return (
    <header className="topbar">
      <div className="container-fluid">
        <div className="navbar-header">
          <div className="d-flex align-items-center">
            <LeftSideBarToggle />
            <TopBarTitle />
          </div>
          <div className="d-flex align-items-center gap-1">
            <ThemeModeToggle />

            {/* <Suspense>
              <Notifications />
            </Suspense> */}

            <ThemeCustomizerToggle />

            {/* <ActivityStreamToggle /> */}
            <LanguageDropdown />
            <ProfileDropdown />
            <form className="app-search d-none d-md-block ms-2">
              <div className="position-relative">
                <input type="search" className="form-control" placeholder={t('topbar.searchPlaceholder')} autoComplete="off" />
                <IconifyIcon icon="solar:magnifer-linear" className="search-widget-icon" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
export default page
