import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import api from "../../../../api";
import { Navigation } from "../../../../components/Navigation";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function TenderEdit({ data }: Props) {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-50" />
      {JSON.stringify(data)}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.params as {
    id: string;
  };

  if (Number.isNaN(Number(id))) {
    return {
      redirect: {
        destination: "/app/tenders",
        permanent: true,
        statusCode: 302,
      },
    };
  }

  const { data } = await api.tenders.show(Number(id));

  if (!data) {
    return {
      notFound: true,
    };
  }

  const session = await api.session.show({
    headers: {
      Cookie: context.req.headers.cookie!,
    },
  });

  const profiles = await api.profiles.index({
    page: 1,
    perPage: 100,
    filters: {
      userId: session.data!.id,
    },
  });

  if (profiles.data!.some((profile) => profile.id === data.profileId)) {
    return {
      props: {
        data,
      },
    };
  }

  return {
    redirect: {
      destination: "/app/tenders",
      permanent: false,
      statusCode: 302,
    },
  };
};
