import Page from '@frontend/components/Page/Page';

export const runtime = 'edge';

interface Props {
  params: {
    id: string;
  };
}

export default function EditPetPage({ params }: Props) {
  const { id } = params;
  return <Page>Pet edit {id} page</Page>;
}
