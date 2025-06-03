import { getMemberByOrganizationId } from "@/actions/party_actions";
import MemberTable from "@/components/organization/member-table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import React, { FC } from "react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const MemberPage: FC<PageProps> = async ({ params }) => {
  const { id } = await params;

  // get members
  const members = await getMemberByOrganizationId(id);

  return (
    <div>
      <Link href={`/${id}/members/new`}>+ New member</Link>
      <br />
      <br></br>
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberTable data={members!} edit={true} />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default MemberPage;
