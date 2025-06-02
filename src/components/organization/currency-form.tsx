"use client";
import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { z } from "zod";
import { NewCurrencySchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { addCurrency } from "@/actions/config_actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type CurrencyFormType = z.infer<typeof NewCurrencySchema>;

const CurrencyForm = ({ orgId }: { orgId: string }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<CurrencyFormType>({
    resolver: zodResolver(NewCurrencySchema),
    defaultValues: {
      name: "",
      symbol: "",
      code: "",
      default: false,
    },
  });

  const onSubmit = async (data: CurrencyFormType) => {
    const validation = NewCurrencySchema.safeParse(data);
    if (validation.success) {
      try {
        // save currency
        if (!session?.user || !session.user.id) {
          return <div>no session user found. You should login again.</div>;
        }
        const newCurrency = await addCurrency(
          validation.data,
          orgId,
          session.user.id
        );
        if (newCurrency) {
          router.replace(`/${orgId}/currencies`);
        }
      } catch (error) {
        console.error("error", error);
      }
    } else {
      console.error("Validation failed", validation.error);
    }
  };

  return (
    <div className="w-1/2 my-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel>Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="symbol.." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="MMK, USD,...." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="default"
            render={({ field }) => (
              <FormItem>
                <FormControl className="my-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FormLabel className="mb-0">Default?</FormLabel>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <Button variant={"outline"}>Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default CurrencyForm;
