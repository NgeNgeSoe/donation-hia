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
import { NewIncomeSchema } from "@/schemas";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "../ui/textarea";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useMemberStore } from "@/lib/stores/personStore";
import { dropdownModel, PayType } from "@/types";

import { Select } from "../ui/select";
import { SelectTrigger } from "../ui/select";
import { SelectValue } from "../ui/select";
import { SelectContent } from "../ui/select";
import { SelectItem } from "../ui/select";
import { addIncome } from "@/actions/transaction_actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";

type NewIncomeFormType = z.infer<typeof NewIncomeSchema>;

const NewIncomeForm = ({
  currencies,
  projectId,
  orgId,
}: {
  currencies: dropdownModel[];
  projectId: string;
  orgId: string;
}) => {
  const member = useMemberStore((state) => state.member);
  const { data: session, status } = useSession();

  const router = useRouter();
  const form = useForm<NewIncomeFormType>({
    resolver: zodResolver(NewIncomeSchema),
    defaultValues: {
      memberId: member?.id,
      amount: 0,
      payType: undefined,
      currencyId: 0,
      transactionDate: new Date(),
      remark: null,
      imgUrl: null,
      projectId: projectId,
    },
  });

  const [open, setOpen] = React.useState(false);
  const [ispending, startTransition] = useTransition();

  if (status === "loading" || ispending) {
    return <div>Loading...</div>;
  }
  if (!session?.user) {
    return <div>No login user found!</div>;
  }

  if (!member || !projectId)
    return <div>Loading..for member or project id.</div>;

  const onSubmit = (data: NewIncomeFormType) => {
    const validation = NewIncomeSchema.safeParse(data);

    if (validation.success) {
      try {
        startTransition(async () => {
          const income = await addIncome(data, session?.user.id);

          if (income) {
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

  return (
    <Card className="w-1/2 my-3">
      <CardHeader>
        <CardTitle>New Income</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (data) => {
                onSubmit(data);
                //console.log("data validation ", data);
              },
              (error) => {
                console.log("", error);
              }
            )}
            className="space-y-5"
          >
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormLabel>
                {member?.fullName}, {member?.nickName}
              </FormLabel>
            </FormItem>
            {/* Hidden form field for memberId */}
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <input type="hidden" {...field} value={member?.id} />
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
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[200px] justify-between"
                        >
                          {field.value
                            ? currencies.find(
                                (currency) =>
                                  currency.value === field.value.toString()
                              )?.label
                            : "Select currency..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search currency..." />
                          <CommandList>
                            <CommandEmpty>No currency found.</CommandEmpty>
                            <CommandGroup>
                              {currencies.map((currency) => (
                                <CommandItem
                                  key={currency.value}
                                  value={currency.value}
                                  onSelect={() => {
                                    field.onChange(Number(currency.value));
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value.toString() === currency.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {currency.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pay Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pay type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PayType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value ? format(field.value, "yyyy-MM-dd") : ""
                      }
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remark</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="remark"
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
                Submit
              </Button>
              <Link href={`/${orgId}/projects/${projectId}/transactions`}>
                <Button variant={"secondary"}> Cancel</Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewIncomeForm;
