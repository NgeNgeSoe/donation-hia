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
import { addProject, updateProject } from "@/actions/project_actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { ProjectWithTotalModel } from "@/types";

type NewProjectForm = z.infer<typeof NewProjectSchema>;

const NewProjectForm = ({
  orgId,
  project,
}: {
  orgId: string;
  project?: ProjectWithTotalModel;
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const form = useForm<NewProjectForm>({
    resolver: zodResolver(NewProjectSchema),
    defaultValues: {
      description: project?.description ?? "",
      location: project?.location ?? "",
      fromDate: project?.from ?? new Date(),
      thruDate: project?.to ?? new Date(),
      openingAmount: project?.openingAmount ?? 0,
    },
  });

  const onSubmit = async (data: NewProjectForm) => {
    const validation = NewProjectSchema.safeParse(data);
    if (validation.success && session && session.user) {
      let result;
      if (!project) {
        result = await addProject(validation.data, orgId, session?.user.id!);
      } else {
        result = await updateProject(project.id, data);
      }

      if (result) {
        router.push(`/${orgId}/projects`);
      }
      console.log("validation submit", validation);
    } else {
      console.error("Validation failed", validation.error);
    }
  };

  return (
    <Card className="my-3 w-1/2">
      <CardHeader>
        <CardTitle>{project ? "Edit Project" : "New Project"}</CardTitle>
      </CardHeader>
      <CardContent>
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
            <div className="flex gap-2">
              <Button type="submit" variant={"outline"}>
                Submit
              </Button>
              <Link href={`/${orgId}/projects`}>
                <Button variant={"secondary"}>Back</Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewProjectForm;
