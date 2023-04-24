import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import api from "../../../../api";

export const getStaticPaths = async () => {
  const { data } = await api.tenders.index({
    page: 1,
    perPage: 100,
  });

  const paths = data!.map((tender) => ({
    params: {
      id: tender.id.toString(),
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async (
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

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Tender({ data }: Props) {
  return <>{JSON.stringify(data)}</>;
}
