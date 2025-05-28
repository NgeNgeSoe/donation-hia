import { Expense } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import React from "react";
import { ExpenseWtihNumberAmount } from "@/types";

const ExpenseTable = ({ data }: { data: ExpenseWtihNumberAmount[] }) => {
  return (
    <Table>
      <TableCaption>A list of project expense</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Description</TableHead>
          <TableHead>Amount</TableHead>

          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell className="font-medium">{expense.description}</TableCell>
            <TableCell>{expense.amount}</TableCell>
            <TableCell className="text-right"> view file</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExpenseTable;
