import Page from '@frontend/components/Page/Page';

export const runtime = 'edge';

interface Props {
  params: {
    id: string;
  };
}

export default function DeletePetPage({ params }: Props) {
  const { id } = params;
  return <Page>Delete pet {id} page</Page>;
}
