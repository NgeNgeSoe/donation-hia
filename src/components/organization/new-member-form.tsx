"use client";

import { NewPersonSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import {
  addPerson,
  addPersonRole,
  getRoleByTerms,
  updatePerson,
} from "@/actions/party_actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Person } from "@prisma/client";
import Link from "next/link";

type NewMemberForm = z.infer<typeof NewPersonSchema>;

const NewMemberForm = ({
  orgId,
  member,
}: {
  orgId: string;
  member?: Person;
}) => {
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<NewMemberForm>({
    resolver: zodResolver(NewPersonSchema),
    defaultValues: {
      fullName: member?.fullName ?? "",
      nickName: member?.nickName ?? "",
      phone: member?.phone ?? "",
      member: member?.member ?? true,
      gender: member?.gender ?? "MALE",
      fromDate: member?.fromDate ?? null,
      thruDate: member?.thruDate ?? null,
    },
  });

  const onSubmit = async (data: NewMemberForm) => {
    const validation = NewPersonSchema.safeParse(data);
    console.log("data", validation);
    if (validation.success) {
      //handle success
      let person;
      if (member?.id) {
        //update
        person = await updatePerson(member.id, data);
        console.log(" update member");
      } else {
        person = await addPerson(data, orgId);
        console.log(" adding member");
        const role = await getRoleByTerms("member");
        if (!role) {
          console.log("member role isn't found!");
        }

        //add personroll
        const personRole = await addPersonRole(
          orgId,
          role?.id!,
          person?.id!,
          session?.user.id!
        );
        if (personRole) {
          console.log("success adding role to person");
          //redirect to member page
        } else {
          console.error("error occur adding role to person");
        }
      }
      if (!person) {
        console.log("error adding member");
      } else {
        router.replace(`/${orgId}/members`);
      }
    } else {
      //handle error
      console.error(validation.error);
    }
  };

  return (
    <Card className="w-1/2 my-3">
      <CardHeader>
        <CardTitle>{member ? "Edit Member" : "New Member"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="full name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nickName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nickame"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="phone" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="member"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member?</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="MALE" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="FEMALE" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                    </RadioGroup>
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
            <div className="flex gap-2">
              <Button type="submit" variant={"outline"}>
                Submit
              </Button>
              <Link href={`/${orgId}/members`}>
                <Button variant={"secondary"}>Cancel</Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewMemberForm;
