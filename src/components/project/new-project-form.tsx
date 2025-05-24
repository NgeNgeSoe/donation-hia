"use client";

import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewProjectSchema } from "@/schemas";
import { date, z } from "zod";
import { Input } from "../ui/input";
import { CalendarIcon, FormInput } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { addProject } from "@/actions/project_actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";

type NewProjectForm = z.infer<typeof NewProjectSchema>;

const NewProjectForm = ({ orgId }: { orgId: string }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const form = useForm<NewProjectForm>({
    resolver: zodResolver(NewProjectSchema),
    defaultValues: {
      description: "",
      location: "",
      fromDate: new Date(),
      thruDate: new Date(),
      openingAmount: 0,
    },
  });

  const onSubmit = async (data: NewProjectForm) => {
    const validation = NewProjectSchema.safeParse(data);
    if (validation.success && session && session.user) {
      const newProject = await addProject(
        validation.data,
        orgId,
        session?.user.id!
      );
      if (newProject) {
        router.push(`/${orgId}/projects`);
      }
      console.log("validation submit", validation);
    } else {
      console.error("Validation failed", validation.error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="description" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="location" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fromDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From Date</FormLabel>
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
          name="thruDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From Date</FormLabel>
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
          name="openingAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opening Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="opening amount"
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              {form.formState.errors.openingAmount && (
                <Label>{form.formState.errors.openingAmount.message}</Label>
              )}
            </FormItem>
          )}
        />
        <Button variant={"outline"}>Submit</Button>
      </form>
    </Form>
  );
};

export default NewProjectForm;
