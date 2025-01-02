'use client';

import { useAuthContext } from '@frontend/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';

interface HeaderLink {
  name: string;
  path: string;
  onClick?: () => void;
}

export default function Header() {
  const pathname = usePathname();
  const { isAuth, logout } = useAuthContext();

  const headerLinks: HeaderLink[] = [
    {
      name: 'Pets',
      path: '/pets',
    },
    {
      name: 'About',
      path: '/about',
    },
    ...(isAuth
      ? [
          {
            name: 'Create Pet',
            path: '/create-pet',
          },
          {
            name: 'Logout',
            path: '/logout',
            onClick: () => logout(),
          },
        ]
      : [
          {
            name: 'Login',
            path: '/auth/login',
          },
        ]),
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div
            style={{
              maxWidth: '45px',
              maxHeight: '45px',
            }}
          >
            <Link href="/" className={styles.logo}>
              <Image
                alt="pet logo"
                src="/pet-logo.jpg"
                placeholder="blur"
                blurDataURL="/pet-logo.jpg"
                width="45"
                height="45"
                priority
              />
            </Link>
          </div>

          <nav className={styles.nav}>
            <ol className={styles.links}>
              {headerLinks.map(link => (
                <li
                  key={link.path}
                  className={
                    pathname === link.path ? styles.linkActive : styles.link
                  }
                >
                  <Link href={link.path} onClick={() => link?.onClick?.()}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </header>
      <div className={styles.spacer} />
    </>
  );
}
