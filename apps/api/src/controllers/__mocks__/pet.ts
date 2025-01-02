import { testImages } from '@api/test/testImages';
import { CreatePetInput } from '@validation/schema/pet.schema';

export const pets: CreatePetInput['body'][] = [
  {
    name: 'Buddy',
    breed: 'Golden Retriever',
    status: 'AVAILABLE',
    age: '12',
    birthDate: '2022',
    description: 'dog',
    tags: ['dog'],
    images: testImages,
  },
  {
    name: 'Mittens',
    breed: 'Siamese',
    status: 'ADOPTED',
    age: '12',
    birthDate: '2022',
    description: 'dog',
    tags: ['dog'],
    images: testImages,
  },
  {
    name: 'Charlie',
    breed: 'Labrador Retriever',
    status: 'AVAILABLE',
    age: '12',
    birthDate: '2022',
    description: 'dog',
    tags: ['dog'],
    images: testImages,
  },
  {
    name: 'Whiskers',
    breed: 'Maine Coon',
    status: 'PENDING',
    age: '12',
    birthDate: '2022',
    description: 'dog',
    tags: ['dog'],
    images: testImages,
  },
  {
    name: 'Max',
    breed: 'Beagle',
    status: 'ADOPTED',
    age: '12',
    birthDate: '2022',
    description: 'dog',
    tags: ['dog'],
    images: testImages,
  },
  {
    name: 'Luna',
    breed: 'Bengal',
    status: 'AVAILABLE',
    age: '12',
    birthDate: '2022',
    description: 'dog',
    tags: ['dog'],
    images: testImages,
  },
];
