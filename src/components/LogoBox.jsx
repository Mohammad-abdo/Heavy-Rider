import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const LogoBox = () => {
  return (
    <div className="logo-box">
      <Link to="/dashboard" className="logo-light d-flex align-items-center gap-2 p-0 text-decoration-none">
        <div className="logo-icon-wrapper">
          <IconifyIcon icon="solar:truck-bold-duotone" className="fs-28 text-primary" />
        </div>
        <div className="logo-text">
          <span className="fw-bold text-dark" style={{ fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
            Heavy Rider
          </span>
        </div>
      </Link>
    </div>
  )
}

export default LogoBox
