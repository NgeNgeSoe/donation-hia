import {
  getExpenseByProjectId,
  getIncomeByProjectId,
  getTransfersByProjectId,
} from "@/actions/transaction_actions";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/transaction/columns";
import ExpenseTable from "@/components/transaction/expense-table";
import TransferTable from "@/components/transaction/transfer-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { IncomeWtihNumberAmount, TransferWithProjects } from "@/types";
import Link from "next/link";
import React, { FC } from "react";

type PageProps = {
  params: Promise<{
    projId: string;
    id: string;
  }>;
};
const ProjectTransactionPage: FC<PageProps> = async ({ params }) => {
  const { projId, id } = await params;
  const data = await getIncomeByProjectId(projId);

  const temp: IncomeWtihNumberAmount[] = data
    ? data.map((item) => ({
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

  const temp_expense = await getExpenseByProjectId(projId);
  const expense =
    temp_expense?.map((exp) => ({
      id: exp.id,
      amount: typeof exp.amount === "number" ? exp.amount : Number(exp.amount),
      description: exp.description,
    })) ?? [];

  const temp_transfers = await getTransfersByProjectId(projId);
  const transfers: TransferWithProjects[] = temp_transfers
    ? temp_transfers.map((trans) => ({
        id: trans.id,
        amount:
          typeof trans.amount === "number"
            ? trans.amount
            : Number(trans.amount),
        fromProject: {
          id: trans.fromProject.id,
          description: trans.toProject.description,
        },
        toProject: {
          id: trans.toProject.id,
          description: trans.toProject.description,
        },
        fromProjectId: trans.fromProjectId,
        toProjectId: trans.toProjectId,
      }))
    : [];

  return (
    <div>
      <Label className="text-xl my-2">Project Transaction</Label>
      <Card className="mb-2">
        <CardHeader>
          <CardTitle>Incomes</CardTitle>
          <Link href={`/${id}/projects/${projId}/search-member`}>
            +New Income
          </Link>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={temp} filterColumn="name" />
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
          <ExpenseTable data={expense ?? []} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Transfer</CardTitle>
          <Link href={`/${id}/projects/${projId}/transfers/new`}>
            +New Transfer
          </Link>
        </CardHeader>
        <CardContent>
          <TransferTable data={transfers ?? []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectTransactionPage;
