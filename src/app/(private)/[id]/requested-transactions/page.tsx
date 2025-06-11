import { getAllDonationRecords } from "@/actions/transaction_actions";
import DonationTable from "@/components/transaction/donation-table";
import React from "react";

const RequestedTransactionPage = async () => {
  const temp_donations = await getAllDonationRecords();

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
  return (
    <div>
      <DonationTable data={donations} />
    </div>
  );
};

export default RequestedTransactionPage;
