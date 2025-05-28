"use client";
import { NewExpenseSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { startTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { dropdownModel } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "../ui/calendar";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Select } from "../ui/select";
import { SelectTrigger } from "../ui/select";
import { SelectValue } from "../ui/select";
import { SelectContent } from "../ui/select";
import { SelectItem } from "../ui/select";
import { addExpense } from "@/actions/transaction_actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type NewExpenseFormType = z.infer<typeof NewExpenseSchema>;

const NewExpenseForm = ({
  currencies,
  projectId,
  orgId,
}: {
  currencies: dropdownModel[];
  projectId: string;
  orgId: string;
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const form = useForm<NewExpenseFormType>({
    resolver: zodResolver(NewExpenseSchema),
    defaultValues: {
      description: "",
      amount: 0,
      projectId: projectId,
      transactionDate: new Date(),
      imgUrl: null,
      currencyId: 1, // Assuming 1 is the default currency ID
    },
  });

  const [open, setOpen] = React.useState(false);

  const onSubmit = (data: NewExpenseFormType) => {
    const validation = NewExpenseSchema.safeParse(data);
    if (!validation.success) {
      console.error("Validation errors:", validation.error.errors);
      return;
    } else {
      try {
        startTransition(async () => {
          const newExpense = await addExpense(
            validation.data,
            session?.user.id!
          );
          if (newExpense) {
            // go to income list page
            router.push(`/${orgId}/projects/${projectId}/transactions`);
          } else {
            console.error("return null from server function");
          }
        });
      } catch (error) {
        console.error("error occurred while sever fun call on form", error);
      }
    }
  };

  if (!projectId) return <div>Loading...</div>;

  return (
    <Card className="w-1/2 my-3">
      <CardHeader>
        <CardTitle>New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (data) => {
                onSubmit(data);
              },
              (error) => {
                console.log("invlaid form error", error);
              }
            )}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <input type="hidden" {...field} value={projectId} />
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="description"
                      {...field}
                      value={field.value ?? ""}
                    />
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
                      type="number"
                      placeholder="amount"
                      value={field.value ?? ""}
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
                </FormItem>
              )}
            />
            <div className="items-start">
              <Button variant={"outline"}>Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewExpenseForm;
