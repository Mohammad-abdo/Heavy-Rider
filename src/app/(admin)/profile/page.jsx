import { useCallback, useEffect, useState } from 'react';
import PageTItle from '@/components/PageTItle';
import { useAuthContext } from '@/context/useAuthContext';
import ProfileAbout from './components/ProfileAbout';
import ProfileMain from './components/ProfileMain';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user: sessionUser, profileData } = useAuthContext();
  const [profile, setProfile] = useState(sessionUser || null);
  const [loading, setLoading] = useState(false);
  const refreshProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await profileData();
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to refresh profile', error);
    } finally {
      setLoading(false);
    }
  }, [profileData]);
  useEffect(() => {
    if (!sessionUser) {
      refreshProfile();
    } else {
      setProfile(sessionUser);
    }
  }, [sessionUser, refreshProfile]);
  return <>
      <PageTItle title={t('profile.pageTitle')} />
      <ProfileMain profile={profile} loading={loading} onRefresh={refreshProfile} />
      <ProfileAbout profile={profile} loading={loading} onRefresh={refreshProfile} />
    </>;
};
export default ProfilePage;