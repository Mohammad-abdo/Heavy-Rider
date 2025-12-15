import { useAuthContext } from '@/context/useAuthContext'
import { Navigate, useLocation } from 'react-router-dom'

const RequireRole = ({ roles, children }) => {
  const { isAuthenticated, role } = useAuthContext()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to={{
          pathname: '/auth/sign-in',
          search: 'redirectTo=' + location.pathname,
        }}
        replace
      />
    )
  }

  // Admin can access everything
  if (role === 'admin' || !roles || roles.length === 0) {
    return children
  }

  if (roles.includes(role)) {
    return children
  }

  // Authenticated but not allowed → redirect to dashboard
  return <Navigate to="/dashboard" replace />
}

export default RequireRole
