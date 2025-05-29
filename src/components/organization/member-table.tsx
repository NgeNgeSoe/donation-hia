"use client";
import React, { FC } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Person } from "@prisma/client";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { useMemberStore } from "@/lib/stores/personStore";
import { Button } from "../ui/button";
import { useParams, useRouter } from "next/navigation";
import { Edit } from "lucide-react";

type Props = {
  data: Person[];
  url?: string;
};
const MemberTable: FC<Props> = ({ data, url }) => {
  const setMember = useMemberStore((state) => state.setMember);
  const router = useRouter();
  const params = useParams();
  const orgId = Array.isArray(params.id) ? params.id[0] : params.id;

  const onHandleSelect = (member: Person) => {
    setMember(member);
    router.push(`${url}?mid=${member.id}`);
  };
  return (
    <Table>
      <TableHeader>
        <RenderHeaderRow />
      </TableHeader>
      <TableBody>
        {url
          ? data.map((item) => (
              <RenderTableRow
                key={item.id}
                item={item}
                onHandle={(e) => onHandleSelect(e)}
                orgId={orgId!}
              />
            ))
          : data.map((item) => (
              <RenderTableRow key={item.id} item={item} orgId={orgId!} />
            ))}
      </TableBody>
    </Table>
  );
};

const RenderHeaderRow = () => (
  <TableRow>
    <TableHead className="w-[100px]">Full Name</TableHead>
    <TableHead className="w-[100px]">Nickname</TableHead>
    <TableHead className="w-[100px]">Phone</TableHead>
    <TableHead className="w-[100px]">Gender</TableHead>
    <TableHead className="w-[100px]">Member?</TableHead>
    <TableHead className="w-[100px]">From</TableHead>
    <TableHead className="w-[100px]">Thru</TableHead>
    <TableHead className="w-[100px]"></TableHead>
  </TableRow>
);

const RenderTableRow = ({
  item,
  onHandle,
  orgId,
}: {
  item: Person;
  orgId: string;
  onHandle?: (item: Person) => void;
}) => {
  return (
    <TableRow>
      <TableCell className="w-[100px]">{item.fullName}</TableCell>
      <TableCell className="w-[100px]">{item.nickName}</TableCell>
      <TableCell className="w-[100px]">{item.phone}</TableCell>
      <TableCell className="w-[100px]">{item.gender}</TableCell>
      <TableCell className="w-[100px]">
        <Checkbox checked={item.member} />
      </TableCell>
      <TableCell className="w-[100px]">
        {item.fromDate ? new Date(item.fromDate).toLocaleDateString() : "-"}
      </TableCell>
      <TableCell className="w-[100px]">
        {item.thruDate ? new Date(item.thruDate).toLocaleDateString() : "-"}
      </TableCell>
      {onHandle ? (
        <TableCell className="w-[100px]">
          <Button variant={"outline"} onClick={() => onHandle(item)}>
            Select
          </Button>
        </TableCell>
      ) : (
        <TableCell>
          <Link href={`/${orgId}/members/edit/${item.id}`}>
            <Edit size={15} />
          </Link>
        </TableCell>
      )}
    </TableRow>
  );
};

export default MemberTable;
