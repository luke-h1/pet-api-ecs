import Page from '@frontend/components/Page/Page';
import petService from '@frontend/services/petService';
import { notFound } from 'next/navigation';
import styles from './PetPage.module.scss';

export const runtime = 'edge';

interface Props {
  params: {
    id: string;
  };
}

export default async function PetPage({ params }: Props) {
  const { id } = params;

  const pet = await petService.getPet(id);

  if (!pet) {
    notFound();
  }

  return (
    <Page>
      <div className={styles.container}>
        <h1 className={styles.heading}>{pet.name}</h1>
        <p className={styles.subheading}>
          Age: {pet.age} - Breed: {pet.breed}
        </p>
        <div className={styles.imageGrid}>
          {pet.images.map(img => (
            <div key={img} className={styles.imageContainer}>
              <img src={img} alt={pet.name} className={styles.image} />
            </div>
          ))}
        </div>
        <p className={styles.description}>{pet.description}</p>
      </div>
    </Page>
  );
}
