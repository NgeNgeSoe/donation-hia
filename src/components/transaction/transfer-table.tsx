"use client";
import React from "react";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "../ui/table";
import { TransferWithProjects } from "@/types";

const TransferTable = ({ data }: { data: TransferWithProjects[] }) => {
  return (
    <Table>
      <TableCaption>A list of project expense</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">To Project</TableHead>
          <TableHead>Amount</TableHead>

          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((trans) => (
          <TableRow key={trans.id}>
            <TableCell className="font-medium">
              {trans.toProject.description}
            </TableCell>
            <TableCell>{trans.amount}</TableCell>
            <TableCell className="text-right"></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransferTable;
