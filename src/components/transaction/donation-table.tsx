"use client";
import { DonationWithAmount } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import React, { FC, useTransition } from "react";
import { DataTable } from "../data-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { Button } from "../ui/button";
import { approveDonationRecord } from "@/actions/transaction_actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type props = {
  data: DonationWithAmount[];
};
const DonationTable: FC<props> = ({ data }) => {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [donations, setDonations] = React.useState(data);
  if (!session) {
    return <div>Please log in to view donation records.</div>;
  }

  const handleApprove = (id: string) => {
    startTransition(async () => {
      const res = await approveDonationRecord(id, session.user.id);
      if (res) {
        setDonations((prev) => prev.filter((item) => item.id !== id));
        toast.success("Donation Approved", {
          description:
            "The donation has been approved and moved to income records.",
        });
      } else {
        toast.error("Approval Failed", {
          description: "There was a problem approving the donation.",
        });
        console.error("Failed to approve donation");
      }
    });
  };
  return (
    <div>
      <Table>
        {/* <TableCaption>A list of project expense</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Project</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Receipt Number</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.project}</TableCell>
              <TableCell>{item.amount}</TableCell>
              <TableCell>{item.receiptNumber}</TableCell>
              <TableCell>{item.createdAt.toLocaleDateString()}</TableCell>
              <TableCell>{item.imageUrl}</TableCell>

              <TableCell className="text-right">
                {session.user.isAdmin ? (
                  <>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">Approve</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleApprove(item.id)}
                          >
                            {isPending ? <Loader2 /> : "Make Approve"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  "waiting for approval"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DonationTable;
