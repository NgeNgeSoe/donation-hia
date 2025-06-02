"use client";

import React from "react";
import { ExpenseWtihNumberAmount } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data-table";

const expneseColumns: ColumnDef<ExpenseWtihNumberAmount>[] = [
  { accessorKey: "id", header: "ID", cell: (info) => info.getValue() },
  {
    accessorKey: "description",
    header: "Description",
    cell: (info) => info.getValue(),
  },
  { accessorKey: "amount", header: "Amount", cell: (info) => info.getValue() },
];

const ExpenseTable = ({ data }: { data: ExpenseWtihNumberAmount[] }) => {
  return (
    <DataTable
      data={data}
      columns={expneseColumns}
      filterColumn="description"
    />
  );
};

export default ExpenseTable;
