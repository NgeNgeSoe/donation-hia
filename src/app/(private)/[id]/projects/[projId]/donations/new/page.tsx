import { getPersonByUserId } from "@/actions/auth_actions";
import MemberDonationForm from "@/components/project/member-donation-form";
import { auth } from "@/lib/auth";
import React, { FC } from "react";

type PageProps = {
  params: Promise<{
    projId: string;
    id: string;
  }>;
};
const DonationRequestPage: FC<PageProps> = async ({ params }) => {
  const session = await auth();
  const { projId, id } = await params;
  if (!session?.user) {
    return <div>no session value</div>;
  }
  const member = await getPersonByUserId(session?.user.id);
  if (!member) {
    return <div>no member found by user id</div>;
  }
  return (
    <div>
      <MemberDonationForm memberId={member.id} projectId={projId} orgId={id} />
    </div>
  );
};

export default DonationRequestPage;
