"use client";

import { NewPersonSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
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
  redirectUrl,
}: {
  orgId: string;
  member?: Person;
  redirectUrl?: string;
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
      fromDate: member?.fromDate ? new Date(member.fromDate) : new Date(),
      thruDate: member?.thruDate ? new Date(member.thruDate) : null,
    },
  });

  const onSubmit = async (data: NewMemberForm) => {
    const validation = NewPersonSchema.safeParse(data);
    console.log("data", validation);
    if (validation.success) {
      if (!session?.user || !session.user.id) {
        return <div>no login user. Login again!</div>;
      }
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

        if (!role || !person) {
          console.log("member role or person isn't found!");
          console.error("no role or person found for member.");
          return null;
        }

        //add personroll
        const personRole = await addPersonRole(
          orgId,
          role?.id,
          person?.id,
          session?.user.id
        );
        if (personRole) {
          console.log("success adding role to person");
          //redirect to member page
        } else {
          console.error("error occur adding role to person");
        }
      }
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        //redirect to member page
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
            {session?.user.isAdmin ? (
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
            ) : null}

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
            {member && (
              <FormField
                control={form.control}
                name="thruDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thru Date</FormLabel>
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
            )}
            <div className="flex gap-2">
              <Button type="submit" variant={"outline"}>
                Submit
              </Button>
              {redirectUrl ? (
                <Link href={redirectUrl}>
                  <Button variant={"secondary"}>Cancel</Button>
                </Link>
              ) : (
                <Link href={`/${orgId}/members`}>
                  <Button variant={"secondary"}>Cancel</Button>
                </Link>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewMemberForm;
