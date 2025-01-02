import { ReactNode } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import PageTransition from '../PageTransition';
import styles from './Page.module.scss';

interface Props {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function Page({
  children,
  showFooter = true,
  showHeader = true,
}: Props) {
  return (
    <div className={styles.container}>
      {showHeader && <Header />}

      <main className={styles.main}>
        <PageTransition>{children}</PageTransition>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}
