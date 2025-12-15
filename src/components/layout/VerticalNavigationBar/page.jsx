import FallbackLoading from '@/components/FallbackLoading';
import LogoBox from '@/components/LogoBox';
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import { getMenuItems } from '@/helpers/Manu';
import { Suspense, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AppMenu from './components/AppMenu';
import HoverMenuToggle from './components/HoverMenuToggle';
const VerticalNavigationBarPage = () => {
  const { t, i18n } = useTranslation();
  const menuItems = useMemo(() => getMenuItems(t), [t, i18n.language]);
  return <div className="main-nav">
      <LogoBox />
      <HoverMenuToggle />
      <SimplebarReactClient className="scrollbar" data-simplebar>
        <Suspense fallback={<FallbackLoading />}>
          <AppMenu menuItems={menuItems} />
        </Suspense>
      </SimplebarReactClient>
    </div>;
};
export default VerticalNavigationBarPage;