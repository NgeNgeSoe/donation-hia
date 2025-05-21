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

type Props = {
  data: Person[];
};
const MemberTable: FC<Props> = ({ data }) => {
  return (
    <Table>
      {/* <TableCaption>Members 33</TableCaption> */}
      <TableHeader>
        <RenderHeaderRow />
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <RenderTableRow key={item.id} item={item} />
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
  </TableRow>
);

const RenderTableRow = ({ item }: { item: Person }) => (
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
  </TableRow>
);

export default MemberTable;
