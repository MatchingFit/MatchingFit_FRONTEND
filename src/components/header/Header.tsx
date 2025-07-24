import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '@/assets/logo.png';
import Icon from '../icon/Icon';
import useUserStore from '@/store/user';
import useAuthStore from '@/store/auth';

const NAV_LINKS = [
  { label: '이력서 분석', to: '/analytics/start' },
  { label: '업무 성향 테스트', to: '' },
  { label: 'HR 담당자 성향 테스트', to: '/hr-test/start' },
] as const;

const Header: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const userName = user?.name ?? '';
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!accessToken;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <Link to="/">
          <img src={logo} alt="매칭핏 로고" className={styles.logo} />
        </Link>
      </h1>
      <nav className={styles.nav}>
        {/* 데스크탑 메뉴 */}
        <ul className={styles.desktopMenu} aria-label="메인 네비게이션">
          {NAV_LINKS.map(({ label, to }) => (
            <li className={styles.navItem} key={label}>
              <Link to={to} onClick={() => setIsMenuOpen(false)}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        {/* 모바일용 햄버거 버튼 */}
        <button
          className={styles.menuBtn}
          type="button"
          aria-label="메뉴 버튼"
          onClick={handleMenuToggle}
        >
          {isMenuOpen ? (
            <Icon id="close" width={20} height={20} color="#000" />
          ) : (
            <Icon id="menu" width={20} height={20} color="#000" />
          )}
        </button>
        <ul aria-label="유저 네비게이션">
          <li>
            {isLoggedIn ? (
              <Link to="/my/profile">{`${userName} 님`}</Link>
            ) : (
              <Link to="/login">로그인/회원가입</Link>
            )}
          </li>
        </ul>
        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className={styles.overlayMenu}>
            <ul className={styles.mobileMenu} aria-label="메인 네비게이션">
              {NAV_LINKS.map(({ label, to }) => (
                <li className={styles.menuItem} key={label}>
                  <Link to={to} onClick={() => setIsMenuOpen(false)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
