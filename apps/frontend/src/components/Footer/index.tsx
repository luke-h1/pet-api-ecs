import Link from 'next/link';
import styles from './Footer.module.scss';

interface FooterLink {
  name: string;
  href: string;
}

const footerLinks: FooterLink[] = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'About',
    href: '/about',
  },
  {
    name: 'Pets',
    href: '/pets',
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <ul className={styles.links}>
        {footerLinks.map(link => (
          <li key={link.name}>
            <Link href={link.href}>{link.name}</Link>
          </li>
        ))}
      </ul>
      <p className={styles.copyright}>
        &copy; Pets API {new Date().getFullYear()}
      </p>
    </footer>
  );
}
