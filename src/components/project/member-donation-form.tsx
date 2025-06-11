"use client";
import React, { useState, useTransition } from "react";
import { MemberDonationSchema } from "@/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Check, Loader2 } from "lucide-react";
import { addDonation } from "@/actions/transaction_actions";
import { Label } from "../ui/label";
import { DonationWithAmount } from "@/types";
import Link from "next/link";

type MemberDoantionFormType = z.infer<typeof MemberDonationSchema>;

const MemberDonationForm = ({
  memberId,
  projectId,
  orgId,
}: {
  memberId: string;
  projectId: string;
  orgId: string;
}) => {
  const form = useForm<MemberDoantionFormType>({
    resolver: zodResolver(MemberDonationSchema),
    defaultValues: {
      memberId: memberId,
      amount: 0,
      imgUrl: null,
      refNumber: null,
      projectId: projectId,
    },
  });

  const [ispending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [donation, setDonation] = useState<DonationWithAmount | null>(null);

  const onSubmit = (data: MemberDoantionFormType) => {
    const validation = MemberDonationSchema.safeParse(data);
    if (validation.success) {
      try {
        startTransition(async () => {
          const res = await addDonation(data);
          if (!res) {
            console.error("donation record return null");
            return;
          }
          console.log("donaciton", donation);
          setSuccess(true);
          setDonation({
            ...res,
          });
          //show success section
        });
      } catch (error) {
        console.error("error occurred while sever fun call on form", error);
      }
    } else {
      console.error("Validation failed", validation.error);
      return;
    }
  };

  return (
    <>
      {success ? (
        <Card className="w-1/2">
          <CardContent>
            <p className="text-sm mb-4 text-center text-gray-500">
              The system send your donation transaction to admin!To enter
              transaction you have to wait sometime for processing.
            </p>
            <p className="flex flex-col justify-center items-center">
              <Label className="text-md">Your donation amount</Label>
              <Label className="text-2xl">{donation?.amount} KS</Label>
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Link href={`/${orgId}/projects`}>
              <Button variant={"outline"}>
                <Check />
                OK
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-1/2 my-3">
          <CardHeader>
            <CardTitle>New Donation</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-5"
                onSubmit={form.handleSubmit(
                  (data) => {
                    console.log(data);
                    onSubmit(data);
                  },
                  (error) => {
                    console.error(error);
                  }
                )}
              >
                {/* Hidden form field for memberId */}
                <FormField
                  control={form.control}
                  name="memberId"
                  render={({ field }) => (
                    <input type="hidden" {...field} value={memberId} />
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <input type="hidden" {...field} value={projectId} />
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="amount"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="refNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remark</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="reference number"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imgUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Rreceipt</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            field.onChange(file);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <Button type="submit" variant={"outline"}>
                    {ispending && <Loader2 />}
                    Submit
                  </Button>
                  {/* <Link href={`/${orgId}/projects/${projectId}/transactions`}>
              <Button variant={"secondary"}> Cancel</Button>
            </Link> */}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MemberDonationForm;
