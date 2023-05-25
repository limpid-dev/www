import { GetStaticProps } from "next";
import api from "../../../../api";
import PaginatedMyProfiles from "./[page]";

export const getStaticProps: GetStaticProps = async () => {
  const profiles = await api.profiles.index({
    page: 1,
    perPage: 9,
  });
  return {
    props: {
      profiles: profiles.data,
      totalProfiles: profiles.meta?.total,
      currentPage: 1,
    },
  };
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
