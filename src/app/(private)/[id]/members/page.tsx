import { getMemberByOrganizationId } from "@/actions/party_actions";
import MemberTable from "@/components/organization/member-table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import Link from "next/link";
import React, { FC } from "react";

type PageProps = {
  params: {
    id: string;
  };
};

const MemberPage: FC<PageProps> = async ({ params }) => {
  const { id } = params;
  const session = await auth();

  // get members
  const members = await getMemberByOrganizationId(session?.user.orgId!);

  return (
    <div>
      <br />
      <Link href={`/${id}/members/new`}>+ New member</Link>
      <br />
      <br></br>
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberTable data={members!} />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default MemberPage;
