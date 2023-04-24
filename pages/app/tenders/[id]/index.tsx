import { GetStaticPropsContext, InferGetServerSidePropsType } from "next";
import api from "../../../../api";

export const getServerSideProps = async (
  context: GetStaticPropsContext<{
    id: string;
  }>
) => {
  const { data } = await api.tenders.show(Number(context.params!.id));

  return {
    props: {
      data,
    },
  };
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Tender({ data }: Props) {
  return <>{JSON.stringify(data)}</>;
}
