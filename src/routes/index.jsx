import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// Dashboard Routes
const Dashboard = lazy(() => import('@/app/(admin)/dashboard/page'))

// Apps Routes

// Pages Routes
const Admins = lazy(() => import('@/app/(admin)/Admins/Admins'))
const Welcome = lazy(() => import('@/app/(admin)/pages/welcome/page'))
const ComingSoon = lazy(() => import('@/app/(other)/coming-soon/page'))
const Maintenance = lazy(() => import('@/app/(other)/maintenance/page'))
const Widgets = lazy(() => import('@/app/(admin)/widgets/page'))
const NotFound = lazy(() => import('@/app/(other)/pages-404/page'))
const Pages404Alt = lazy(() => import('@/app/(admin)/pages/pages-404-alt/page'))
const Settings = lazy(() => import('@/app/(admin)/settings/page'))
const Profile = lazy(() => import('@/app/(admin)/profile/page'))
const Permissions = lazy(() => import('@/app/(admin)/permissions/page'))
const CranesPage = lazy(() => import('@/app/(admin)/heavy-ride/cranes/page'))
const RidesPage = lazy(() => import('@/app/(admin)/heavy-ride/rides/page'))
const DriversPage = lazy(() => import('@/app/(admin)/heavy-ride/drivers/page'))
const TransactionsPage = lazy(() => import('@/app/(admin)/heavy-ride/transactions/page'))

// Role Routes
const RoleList = lazy(() => import('@/app/(admin)/role/role-list/page'))
const RoleEdit = lazy(() => import('@/app/(admin)/role/role-edit/page'))
const RoleAdd = lazy(() => import('@/app/(admin)/role/role-add/page'))

// Auth Routes
const SignIn = lazy(() => import('@/app/(other)/auth/sign-in/page'))
const SignUp = lazy(() => import('@/app/(other)/auth/sign-up/page'))
const ResetPassword = lazy(() => import('@/app/(other)/auth/reset-pass/page'))
const VerifyCode = lazy(() => import('@/app/(other)/auth/verify-code/page'))
const LockScreen = lazy(() => import('@/app/(other)/auth/lock-screen/page'))
const initialRoutes = [
  {
    path: '/',
    name: 'root',
    element: <Navigate to="/dashboard" />,
  },
]
const generalRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: <Dashboard />,
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <Profile />,
  },
]

const customRoutes = [
  {
    name: 'Welcome',
    path: '/pages/welcome',
    element: <Welcome />,
  },
  {
    name: 'Error 404 Alt',
    path: '/pages/pages-404-alt',
    element: <Pages404Alt />,
  },
  {
    name: 'Widgets',
    path: '/widgets',
    element: <Widgets />,
  },
  {
    name: 'Settings',
    path: '/settings',
    element: <Settings />,
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <Profile />,
  },
  {
    name: 'Permissions',
    path: '/permissions',
    element: <Permissions />,
  },
]
const heavyRideRoutes = [
  {
    name: 'Cranes',
    path: '/heavy-ride/cranes',
    element: <CranesPage />,
  },
  {
    name: 'Rides',
    path: '/heavy-ride/rides',
    element: <RidesPage />,
  },
  {
    name: 'Drivers',
    path: '/heavy-ride/drivers',
    element: <DriversPage />,
  },
  {
    name: 'Transactions',
    path: '/heavy-ride/transactions',
    element: <TransactionsPage />,
  },
]

const RoleRoutes = [
  {
    name: 'Role List',
    path: '/role/role-list',
    element: <RoleList />,
  },
  {
    name: 'Role Edit',
    path: '/role/role-edit',
    element: <RoleEdit />,
  },
  {
    name: 'Role Add',
    path: '/role/role-add',
    element: <RoleAdd />,
  },
]
const AdminRputes = [
  {
    name: 'Admins',
    path: '/admins',
    element: <Admins />,
  },
]

export const authRoutes = [
  {
    name: 'Sign In',
    path: '/auth/sign-in',
    element: <SignIn />,
  },
  {
    name: 'Sign Up',
    path: '/auth/sign-up',
    element: <SignUp />,
  },
  {
    name: 'Reset Password',
    path: '/auth/reset-pass',
    element: <ResetPassword />,
  },
  {
    name: 'Verify Email',
    path: '/auth/verify-code',
    element: <VerifyCode />,
  },
  {
    name: 'Lock Screen',
    path: '/auth/lock-screen',
    element: <LockScreen />,
  },
  {
    name: '404 Error',
    path: '/pages-404',
    element: <NotFound />,
  },
  //   {
  //     path: '*',
  //     name: 'not-found',
  //     element: <NotFound />,
  //   },
  {
    name: 'Maintenance',
    path: '/maintenance',
    element: <Maintenance />,
  },
  {
    name: 'Coming Soon',
    path: '/coming-soon',
    element: <ComingSoon />,
  },
]
export const appRoutes = [...initialRoutes, ...generalRoutes, ...customRoutes, ...heavyRideRoutes, , ...RoleRoutes, ...AdminRputes]
