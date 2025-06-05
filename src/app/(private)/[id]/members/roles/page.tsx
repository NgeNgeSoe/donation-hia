import RoleTable from "@/components/organization/role-table";
import React from "react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const UserRolePage = async ({ params }: PageProps) => {
  const { id } = await params;
  return (
    <div>
      <RoleTable roles={["admin", "member"]} orgId={id} />
    </div>
  );
};

export default UserRolePage;
