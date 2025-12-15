import logoDark from '@/assets/images/logo-dark.png';
import logoLight from '@/assets/images/logo-light.png';
import smallImg from '@/assets/images/small/img-10.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, Col, Row } from 'react-bootstrap';
import SignUpForm from './SignUpForm';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SignUp = () => {
  const { t } = useTranslation();
  return <div className="d-flex flex-column min-vh-100 p-3">
      <div className="d-flex flex-column flex-grow-1">
        <Row className="h-100 g-0">
          <Col xxl={7} className="d-flex align-items-center justify-content-center">
            <Row className="w-100 justify-content-center">
              <Col lg={7} md={10} sm={12} className="py-4 py-lg-5">
                <div className="d-flex flex-column h-100 justify-content-center">
                  <div className="auth-logo mb-4 d-flex justify-content-center align-items-center">
                    <Link to="/dashboard" className="logo-dark d-flex align-items-center gap-2">
                      <img src={logoDark} height={32} alt="logo dark" />
                    </Link>
                    <Link to="/dashboard" className="logo-light d-flex align-items-center gap-2">
                      <img src={logoLight} height={32} alt="logo light" />
                    </Link>
                  </div>
                  <h2 className="fw-bold fs-24 text-center text-md-start">{t('auth.signUp.title')}</h2>
                  <p className="text-muted mt-1 mb-3 text-center text-md-start">{t('auth.signUp.subtitle')}</p>
                  <div>
                    <SignUpForm />
                    <p className="mt-3 fw-semibold no-span text-center text-muted">{t('auth.signUp.orWith')}</p>
                    <div className="d-grid gap-2 mb-2">
                      <Link to="" className="btn btn-soft-dark">
                        <IconifyIcon icon="bxl:google" className="fs-20 me-1" /> {t('auth.signUp.withGoogle')}
                      </Link>
                      <Link to="" className="btn btn-soft-primary">
                        <IconifyIcon icon="bxl:facebook" className="fs-20 me-1" /> {t('auth.signUp.withFacebook')}
                      </Link>
                    </div>
                  </div>
                  <p className="mt-auto text-danger text-center">
                    {t('auth.signUp.haveAccount')}{' '}
                    <Link to="/auth/sign-in" className="text-dark fw-bold ms-1">
                      {t('auth.signIn.title')}
                    </Link>
                  </p>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xxl={5} className="d-none d-xxl-flex">
            <Card className="h-100 mb-0 overflow-hidden border-0 rounded-0">
              <div className="d-flex flex-column h-100">
                <img src={smallImg} height={867} width={759} alt="small-img" className="w-100 h-100 object-fit-cover" />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>;
};
export default SignUp;