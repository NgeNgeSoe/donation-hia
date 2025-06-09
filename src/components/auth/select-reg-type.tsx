"use client";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterTypeSchema } from "@/schemas";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type RegisterTypeForm = z.infer<typeof RegisterTypeSchema>;

const SelectRegType = () => {
  const route = useRouter();
  const form = useForm<RegisterTypeForm>({
    resolver: zodResolver(RegisterTypeSchema),
    defaultValues: {
      type: "",
    },
  });

  const onSubmit = (data: RegisterTypeForm) => {
    if (data.type == "MEMBER") {
      route.push("/validate-phone");
    } else if (data.type === "ORGANIZATION") {
      route.push("/organization/new");
    } else {
      return;
    }
  };
  return (
    <Card className="w-1/3">
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(
              (data) => {
                onSubmit(data);
              },
              (error) => {
                console.error(error);
              }
            )}
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Registration Type</FormLabel>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ORGANIZATION" id="organization" />
                      <Label htmlFor="organization">New Organization</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="MEMBER" id="member" />
                      <Label htmlFor="member">New Member</Label>
                    </div>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button variant={"outline"} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SelectRegType;
