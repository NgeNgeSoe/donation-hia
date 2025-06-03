"use client";
import React, { FC } from "react";

import { Person } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data-table";
import { useMemberStore } from "@/lib/stores/personStore";
import { useParams, useRouter } from "next/navigation";

type Props = {
  data: Person[];
  url?: string;
  edit?: boolean;
};

const memeberColumns: ColumnDef<Person>[] = [
  //{ accessorKey: "id", header: "ID", cell: (info) => info.getValue() },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "nickName",
    header: "Nickname",
    cell: (info) => info.getValue(),
  },
  { accessorKey: "phone", header: "Phone", cell: (info) => info.getValue() },
  {
    accessorKey: "member",
    header: "Member?",
    cell: (info) => info.getValue(),
  },
  { accessorKey: "gender", header: "Gender", cell: (info) => info.getValue() },
  {
    accessorKey: "fromDate",
    header: "From",
    cell: (info) => {
      const value = info.getValue();
      return value &&
        (typeof value === "string" ||
          typeof value === "number" ||
          value instanceof Date)
        ? new Date(value).toLocaleDateString()
        : "-";
    },
  },
  {
    accessorKey: "thruDate",
    header: "Thru",
    cell: (info) => {
      const value = info.getValue();
      return value &&
        (typeof value === "string" ||
          typeof value === "number" ||
          value instanceof Date)
        ? new Date(value).toLocaleDateString()
        : "-";
    },
  },
];

const MemberTable: FC<Props> = ({ data, url, edit }) => {
  const setMember = useMemberStore((state) => state.setMember);
  const router = useRouter();
  const params = useParams();
  const orgId = Array.isArray(params.id) ? params.id[0] : params.id;

  const onHandleSelect = (member: Person) => {
    setMember(member);
    router.push(`${url}?mid=${member.id}`);
  };

  const onHandleEdit = (member: Person) => {
    router.push(`/${orgId}/members/edit/${member.id}`);
  };

  return (
    <DataTable
      data={data}
      columns={memeberColumns}
      filterColumn="fullName"
      {...(url && { onSelect: onHandleSelect })}
      {...(edit && { onEdit: onHandleEdit })}
    />
  );
};

export default MemberTable;
