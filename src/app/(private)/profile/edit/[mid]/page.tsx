import React, { FC } from "react";
import { getPersonById } from "@/actions/party_actions";
import NewMemberForm from "@/components/organization/new-member-form";
type PageProps = {
  params: Promise<{
    id: string;
    mid: string;
  }>;
};
const EditProfilePage: FC<PageProps> = async ({ params }) => {
  const { id, mid } = await params;
  const member = await getPersonById(mid);
  return (
    <div>
      <NewMemberForm orgId={id} member={member!} redirectUrl="/profile" />
    </div>
  );
};

export default EditProfilePage;
