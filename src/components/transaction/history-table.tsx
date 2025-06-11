"use client";
import React, { FC } from "react";
import { DataTable } from "../data-table";
import { ColumnDef } from "@tanstack/react-table";
import { IncomeWtihNumberAmount } from "@/types";

type props = {
  data: IncomeWtihNumberAmount[];
};
const HistoryTable: FC<props> = ({ data }) => {
  return (
    <DataTable data={data} columns={recordColumns} filterColumn="remark" />
  );
};

const recordColumns: ColumnDef<IncomeWtihNumberAmount>[] = [
  {
    accessorKey: "transactionDate",
    header: "Transaction Date",
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
    accessorKey: "project",
    header: "Project",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "payType",
    header: "Pay Type",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "remark",
    header: "Remark",
    cell: (info) => info.getValue(),
  },
];

export default HistoryTable;
