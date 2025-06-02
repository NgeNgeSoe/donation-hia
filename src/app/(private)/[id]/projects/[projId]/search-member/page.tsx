import SearBox from "@/components/project/search-box";
import React, { FC } from "react";

type PageProps = {
  params: {
    id: string;
    projId: string;
  };

  //   searchParams: {
  //     [key: string]: string | string[] | undefined;
  //   };
};

const SerachMemberPage: FC<PageProps> = async ({ params }) => {
  const { id, projId } = await params;
  //const queryString = await searchParams?.proj;

  return <SearBox orgId={id} projectId={projId} />;
};

export default SerachMemberPage;
