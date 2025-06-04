"use client";
import React, { FC, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { ProjectWithTotalModel } from "@/types";
import { Button } from "../ui/button";
import {
  EyeIcon,
  HeartHandshake,
  Image,
  PhoneOutgoingIcon,
  SquarePen,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { deleteProject } from "@/actions/project_actions";
import { useRouter } from "next/navigation";

type ProjectProps = {
  item: ProjectWithTotalModel;
  orgId: string;
};

const ProjectItem: FC<ProjectProps> = ({ item, orgId }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProject(item.id);
      if (result.success) {
        router.refresh();
      } else {
        console.error(result.message);
      }
    });
  };
  return (
    <Card className="w-1/3">
      <CardHeader>
        <CardTitle>{item.description}</CardTitle>
        <CardDescription>{item.location}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 py-2">
        <div className="flex flex-row">
          <Label>Opening Amount:</Label>
          <Label className="text-right block flex-1">
            {item.openingAmount} Ks
          </Label>
        </div>
        <div className="flex flex-row">
          <Label>Income Amount:</Label>
          <Label className="text-right block flex-1">
            {item.IncomeAmount} Ks
          </Label>
        </div>
        <div className="flex flex-row">
          <Label>Peroid Form:</Label>
          <Label className="text-right block flex-1 text-xs text-gray-400">
            {item.from.toLocaleDateString()} - {item.to?.toLocaleDateString()}
          </Label>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-1 flex-wrap gap-2 justify-end">
          <Link href={`/${orgId}/projects/${item.id}/edit`}>
            <Button variant={"outline"}>
              <SquarePen /> Edit
            </Button>
          </Link>
          <Link href={`/${orgId}/projects/${item.id}/transactions`}>
            <Button variant={"outline"}>
              <EyeIcon /> View
            </Button>
          </Link>
          <Link href={`/${orgId}/projects/${item.id}/search-member`}>
            <Button variant={"outline"}>
              <HeartHandshake /> Donate
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"outline"}>
                <Trash2 /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  project and remove project data from the servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction disabled={isPending} onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Link href={`/${orgId}/projects/${item.id}/photos`}>
            <Button variant={"outline"}>
              <Image /> Gallery
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectItem;
