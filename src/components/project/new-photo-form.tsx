"use client";
import React, { useRef, useState, useTransition } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPhotoFormSchema } from "@/schemas";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { addPhoto } from "@/actions/project_actions";
import { useSession } from "next-auth/react";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { Gallery } from "@prisma/client";

type NewPhotoFormType = z.infer<typeof NewPhotoFormSchema>;
const NewPhotoForm = ({
  projectId,
  orgId,
  photos,
}: {
  projectId: string;
  orgId: string;
  photos: Gallery[];
}) => {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<NewPhotoFormType>({
    resolver: zodResolver(NewPhotoFormSchema),
    defaultValues: {
      projectId: projectId,
      imgUrl: null,
    },
  });

  const [ispending, startTransition] = useTransition();
  const [images, setImages] = useState(photos);

  if (!session?.user) {
    return <div>No login user found!</div>;
  }

  const onSubmit = (data: NewPhotoFormType) => {
    const validation = NewPhotoFormSchema.safeParse(data);
    if (validation.success) {
      try {
        startTransition(async () => {
          const uploaded = await addPhoto(data, session.user.id);
          if (uploaded) {
            //show image in photo division
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            form.setValue("imgUrl", null);

            setImages((prev) => [...prev, uploaded]);
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
    <div>
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>New photo</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-7"
              onSubmit={form.handleSubmit(
                (data) => {
                  onSubmit(data);
                  //console.log("data validation ", data);
                },
                (error) => {
                  console.log("", error);
                }
              )}
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
                name="imgUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        name={field.name}
                        ref={(el) => {
                          field.ref(el);
                          fileInputRef.current = el;
                        }}
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
              <div className="flex gap-3">
                <Button type="submit" variant={"outline"}>
                  {ispending && <LoaderIcon />}
                  Submit
                </Button>
                <Link href={`/${orgId}/projects`}>
                  <Button variant={"secondary"}> Cancel</Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="my-4">
        <CardContent>
          {images && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((element, index) => (
                <div
                  key={index}
                  className="bg-red-100 flex justify-center items-center"
                >
                  <Image
                    alt={element.imageUrl}
                    src={`/img/${element.imageUrl}`}
                    width={200}
                    height={200}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPhotoForm;
