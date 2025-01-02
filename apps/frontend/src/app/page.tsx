'use client';

import Page from '@frontend/components/Page/Page';
import { FiArrowUpRight } from 'react-icons/fi';
import styles from './Home.module.scss';

export default function Home() {
  return (
    <Page>
      <section className={styles.section}>
        <div className={styles.flex}>
          <div className={styles.headingContainer}>
            <h1 className={styles.heading}>Welcome to Pets</h1>
          </div>
          <h2 className={styles.subheading}>Pets is a pet adoption platform</h2>
          <div className={styles.buttonContainer}>
            <a
              className={`${styles.button} ${styles.ghostButton}`}
              href="https://github.com/luke-h1/pets-api"
            >
              Github <FiArrowUpRight className={styles.icon} />
            </a>
            <a
              className={`${styles.button} ${styles.ghostButton}`}
              href="/pets"
            >
              View pets
            </a>
          </div>
        </div>
      </section>
    </Page>
  );
}
