import { Pet } from '@validation/schema/pet.schema';
import Link from 'next/link';
import styles from './PetCard.module.scss';

interface Props {
  pet: Pet;
}

function PetCard({ pet }: Props) {
  return (
    <div className={styles.card}>
      <Link href={`/pets/${pet.id}`}>
        <div className={styles.cardBody}>
          <img src={pet.images[0]} className={styles.image} alt={pet.name} />
          <div className={styles.stack}>
            <h2 className={styles.heading}>{pet.name}</h2>
            <p className={styles.text}>{pet.description.slice(0, 60)}</p>
            <p className={styles.age}>Age: {pet.age}</p>
          </div>
        </div>
      </Link>
      <hr className={styles.divider} />
      <div className={styles.cardFooter}>
        <div className={styles.buttonGroup}>
          <Link href={`/pets/${pet.id}`}>
            <button
              className={`${styles.button} ${styles.solidButton}`}
              type="button"
            >
              View
            </button>
          </Link>
          <button
            className={`${styles.button} ${styles.ghostButton}`}
            type="button"
          >
            Like
          </button>
        </div>
      </div>
    </div>
  );
}

export default PetCard;
