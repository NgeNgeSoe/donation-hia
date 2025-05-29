import { getPersonById } from "@/actions/party_actions";
import NewMemberForm from "@/components/organization/new-member-form";
import React, { FC } from "react";

type PageProps = {
  params: {
    id: string;
    memberId: string;
  };
};
const EditMemberPage: FC<PageProps> = async ({ params }) => {
  const { id, memberId } = await params;
  const member = await getPersonById(memberId);
  return (
    <div>
      <NewMemberForm orgId={id} member={member!} />
    </div>
  );
};

export default EditMemberPage;
