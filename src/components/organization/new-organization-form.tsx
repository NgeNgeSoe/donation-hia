"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { NewOrganizationSchema, NewPersonSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  addOrganization,
  addPerson,
  addPersonRole,
  addUserPerson,
  getRoleByTerms,
} from "@/actions/party_actions";

import { useSession } from "next-auth/react";
import { Gender } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const NewOrganizationForm = () => {
  const session = useSession();

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof NewOrganizationSchema>>({
    resolver: zodResolver(NewOrganizationSchema),
    defaultValues: {
      name: "",
      description: "",
      logo: "",
    },
  });

  if (!session.data?.user || !session.data?.user?.id) {
    return <div>not found login user</div>;
  }

  const toCreatePerson: z.infer<typeof NewPersonSchema> = {
    fullName: session.data?.user.name ?? "",
    phone: "N/A",
    member: true,
    nickName: "N/A",
    gender: Gender.MALE,
  };

  const onSubmit = async (data: z.infer<typeof NewOrganizationSchema>) => {
    setLoading(true);
    try {
      addOrganization(data)
        .then((res) => {
          if (res && !("error" in res)) {
            const orgId = res.id;

            addPerson(toCreatePerson, orgId).then(async (res) => {
              if (res && !("error" in res)) {
                setLoading(false);
                setError("");

                console.log("added person", res);
                //get admin role
                const role = await getRoleByTerms("admin");
                if (!role) {
                  console.error("no admin role foud");
                  return null;
                }
                //add userperson and role
                addUserPerson(res.id).then(async (res) => {
                  if (res && !("error" in res)) {
                    //add user person
                    console.log("added user person", res);
                    addPersonRole(
                      orgId,
                      role?.id,
                      res.personId,
                      session.data?.user?.id!
                    ).then((res) => {
                      if (res && !("error" in res)) {
                        // success registeration
                        console.log("added person role", res);
                        router.push("/dashboard");
                      } else if (res && "error" in res) {
                        setError("error adding person role");
                      }
                    });
                  } else if (res && "error" in res) {
                    setLoading(false);
                    setError("error adding user person");
                  }
                });
              } else if (res && "error" in res) {
                setLoading(false);
                setError("error creating person");
              }
            });
          } else if (res && "error" in res) {
            setError(res.error);
          }
        })
        .catch((err) => {
          setError("An unexpected error occurred.");
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Error creating organization:", error);
      setError("An unexpected error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle> New organization Form</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="mb-4 text-center text-blue-600">Submitting...</div>
          )}
          {error && (
            <div className="mb-4 text-center text-red-600">{error}</div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="description"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => {
                          // handle file selection, e.g., store file name or file object
                          field.onChange(e.target.files?.[0]?.name || "");
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button variant={"outline"} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewOrganizationForm;
