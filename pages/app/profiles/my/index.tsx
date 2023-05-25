import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticProps,
} from "next";
import api from "../../../../api";
import PaginatedMyProfiles from "./[page]";

const tabs = [
  { name: "Все профили", href: "/app/profiles/", current: false },
  { name: "Мои профили", href: "/app/profiles/my", current: true },
];

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{
    id: string;
  }>
) => {
  const session = await api.session.show({
    headers: {
      Cookie: context.req.headers.cookie!,
    },
    credentials: "include",
  });
  if (session) {
    const profiles = await api.profiles.index({
      page: 1,
      perPage: 9,
      filters: {
        userId: session.data!.id,
      },
    });
    return {
      props: {
        profiles: profiles.data,
        totalProfiles: profiles.meta?.total,
        currentPage: 1,
      },
    };
  }
};

export default function MyProfiles({
  profiles,
  totalProfiles,
  currentPage,
}: any) {
  return (
    <div>
      <PaginatedMyProfiles
        profiles={profiles}
        totalProfiles={totalProfiles}
        currentPage={currentPage}
      />
    </div>
  );
}
