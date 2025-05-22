import NewMemberForm from "@/components/organization/new-member-form";
import React, { FC } from "react";

type PageProps = {
  params: {
    id: string;
  };
};

const NewMemberPage: FC<PageProps> = async ({ params }) => {
  const { id } = await params;

  return (
    <div>
      new member page
      <NewMemberForm orgId={id} />
    </div>
  );
};

export default NewMemberPage;
