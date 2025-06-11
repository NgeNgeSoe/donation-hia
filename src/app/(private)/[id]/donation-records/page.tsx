import {
  getDonationByPersonId,
  getIncomeByPersonId,
} from "@/actions/transaction_actions";
import DonationTable from "@/components/transaction/donation-table";
import HistoryTable from "@/components/transaction/history-table";
import { auth } from "@/lib/auth";
import { IncomeWtihNumberAmount } from "@/types";
import { Label } from "@radix-ui/react-dropdown-menu";
import React, { FC } from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};
const DonationRecordsPage: FC<PageProps> = async ({ params }) => {
  const { id } = await params;
  console.log(id);
  const session = await auth();
  if (!session) {
    return <div>Please log in to view donation records.</div>;
  }

  //get donation records
  const temp_donations = await getDonationByPersonId(session.user.id);

  const donations = temp_donations
    ? temp_donations.map((item) => ({
        id: item.id,
        amount:
          typeof item.amount === "number" ? item.amount : Number(item.amount), // keep as Decimal
        imageUrl: item.imageUrl,
        receiptNumber: item.receiptNumber,
        project: item.project ? item.project.description : "N/A",
        createdAt: item.createdAt,
        personId: item.personId,
        projectId: item.projectId, // Add this line to include projectId
      }))
    : [];

  //get transaction histories by memeber
  const temp_records = await getIncomeByPersonId(session.user.id);
  const records: IncomeWtihNumberAmount[] = temp_records
    ? temp_records.map((item) => ({
        id: item.id,
        amount:
          typeof item.amount === "number" ? item.amount : Number(item.amount),
        payType: item.payType,
        memberId: item.memberId,
        remark: item.remark,
        name: "N/A",
        phone: "N/A",
        transactionDate: item.transaction?.transactionDate
          ? new Date(item.transaction.transactionDate).toLocaleDateString()
          : "-",
        project: item.transaction?.project?.description || "N/A",
      }))
    : [];

  return (
    <div>
      {donations && donations.length > 0 ? (
        <div className="w-2/3">
          <Label className="text-l my-3">Pending Transactions</Label>
          <DonationTable data={donations} />
        </div>
      ) : null}
      {records && (
        <div className="my-8">
          <div className="border-b-0 border-gray-100 border-t-1 mb-8"></div>
          <Label className="text-l">Donation Histoires</Label>
          <HistoryTable data={records} />
        </div>
      )}
    </div>
  );
};

export default DonationRecordsPage;
