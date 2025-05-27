import {
  getExpenseByProjectId,
  getIncomeByProjectId,
} from "@/actions/transaction_actions";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/transaction/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncomeWtihNumberAmount } from "@/types";
import { Income } from "@prisma/client";
import Link from "next/link";
import React, { FC } from "react";

async function getData(): Promise<IncomeWtihNumberAmount[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      payType: "KPAY",
      memberId: "12345",
      remark: "Payment for services",
      name: "John Doe",
      phone: "123-456-7890",
    },
    {
      id: "728ed52e",
      amount: 1000,
      payType: "KPAY",
      memberId: "123456",
      remark: "Payment for services",
      name: "John Doe 1",
      phone: "123-456-7890",
    },
    // ...
  ];
}

type PageProps = {
  params: {
    projId: string;
    id: string;
  };
};
const ProjectTransactionPage: FC<PageProps> = async ({ params }) => {
  const data = await getData();
  const { projId, id } = await params;
  const data1 = await getIncomeByProjectId(projId);

  const temp: IncomeWtihNumberAmount[] = data1
    ? data1.map((item: any) => ({
        id: item.id,
        amount:
          typeof item.amount === "number" ? item.amount : Number(item.amount),
        payType: item.payType,
        memberId: item.memberId,
        remark: item.remark,
        name: item.member?.fullName ?? "N/A",
        phone: item.member?.phone ?? "N/A",
      }))
    : [];

  console.log("data1", data1);
  const expense = await getExpenseByProjectId(projId);
  console.log("expense", expense);

  return (
    <div>
      <h1>Project Transaction Page</h1>
      <Card>
        <CardHeader>
          <CardTitle>Incomes</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={temp} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Expense</CardTitle>
          <Link href={`/${id}/projects/${projId}/expense/new`}>
            +New Expense
          </Link>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={temp} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectTransactionPage;
