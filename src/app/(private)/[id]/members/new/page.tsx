import NewMemberForm from "@/components/organization/new-member-form";
import { Label } from "@/components/ui/label";
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
      <NewMemberForm orgId={id} />
    </div>
  );
};

export default NewMemberPage;
