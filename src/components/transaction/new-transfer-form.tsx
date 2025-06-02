"use client";
import React, { useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewTransferSchema } from "@/schemas";
import { z } from "zod";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { SelectTrigger } from "../ui/select";
import { SelectValue } from "../ui/select";
import { SelectContent } from "../ui/select";
import { SelectItem } from "../ui/select";
import { dropdownModel, ProjectWithTotalModel } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { addTransfer } from "@/actions/transaction_actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";

type NewTransferFormType = z.infer<typeof NewTransferSchema>;

const NewTransferForm = ({
  currencies,
  projectId,
  toProjects,
  fromProject,
  orgId,
}: {
  currencies: dropdownModel[];
  projectId: string;
  orgId: string;
  toProjects: dropdownModel[];
  fromProject: ProjectWithTotalModel;
}) => {
  const { data: session } = useSession();
  if (!session?.user) {
    return <div>No login user found</div>;
  }
  const router = useRouter();

  const form = useForm<NewTransferFormType>({
    resolver: zodResolver(NewTransferSchema),
    defaultValues: {
      fromProjectId: projectId,
      toProjectId: "",
      amount: 0,
      currencyId: 1,
      transactionDate: new Date(),
    },
  });

  const [ispending, startTransition] = useTransition();

  const onSubmit = (data: NewTransferFormType) => {
    const validation = NewTransferSchema.safeParse(data);
    if (validation.success) {
      try {
        startTransition(async () => {
          const transfer = await addTransfer(data, session?.user.id);

          if (transfer) {
            // go to income list page
            router.push(`/${orgId}/projects/${projectId}/transactions`);
          } else {
            console.error("return null from server function");
          }
        });
      } catch (error) {
        console.error("error occurred while sever fun call on form", error);
      }
    } else {
      console.error("Validation failed", validation.error);
      return;
    }
  };

  if (!projectId) return <div>Loading...</div>;

  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>New Transfer</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (data) => {
                onSubmit(data);
              },
              (error) => {
                console.error("invlaid form error", error);
              }
            )}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="fromProjectId"
              render={({ field }) => (
                <FormItem className="flex gap-5">
                  <input type="hidden" {...field} value={field.value} />
                  <div>
                    <FormLabel>From Project</FormLabel>
                  </div>
                  <div className="flex flex-col gap-2">
                    <FormLabel>{fromProject.description}</FormLabel>
                    <FormLabel>{fromProject.location}</FormLabel>
                    <FormLabel>
                      {fromProject.from.toLocaleDateString()}-
                      {fromProject.to?.toLocaleDateString()}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toProjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Project</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => field.onChange(val)}
                      value={field.value?.toString() ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {toProjects.map((proj) => (
                          <SelectItem key={proj.value} value={proj.value}>
                            {proj.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FormMessage /> */}
                  </FormControl>
                </FormItem>
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
                      placeholder="amount"
                      {...field}
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currencyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value?.toString() ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pay type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem
                            key={currency.value}
                            value={currency.value}
                          >
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FormMessage /> */}
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transactionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {field.value ? (
                            format(field.value, "P")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              <Button type="submit" variant={"outline"}>
                Submit
              </Button>
              <Link href={`/${orgId}/projects/${projectId}/transactions`}>
                <Button>Cancel</Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewTransferForm;
