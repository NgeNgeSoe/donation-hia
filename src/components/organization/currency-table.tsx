import React, { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { CurrencyWithCreatedBy } from "@/actions/config_actions";

type CurrencyProps = {
  data: CurrencyWithCreatedBy[];
};

const CurrencyTable: FC<CurrencyProps> = ({ data }) => {
  return (
    <Table>
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
    <TableHead className="w-[100px]">Name</TableHead>
    <TableHead className="w-[100px]">Symbol</TableHead>
    <TableHead className="w-[100px]">Code</TableHead>
    <TableHead className="w-[100px]">Default?</TableHead>
    <TableHead className="w-[100px]">Active?</TableHead>
    <TableHead className="w-[100px]">CraetedBy</TableHead>
    <TableHead className="w-[100px]">CreatedOn</TableHead>
  </TableRow>
);

const RenderTableRow = ({ item }: { item: CurrencyWithCreatedBy }) => (
  <TableRow>
    <TableCell className="w-[100px]">{item.name}</TableCell>
    <TableCell className="w-[100px]">{item.symbol}</TableCell>
    <TableCell className="w-[100px]">{item.code}</TableCell>

    <TableCell className="w-[100px]">
      <Checkbox checked={item.default} />
    </TableCell>
    <TableCell className="w-[100px]">
      <Checkbox checked={item.active} />
    </TableCell>
    <TableCell className="w-[100px]">{item.createdBy.fullName}</TableCell>
    <TableCell className="w-[100px]">
      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
    </TableCell>
  </TableRow>
);
export default CurrencyTable;
