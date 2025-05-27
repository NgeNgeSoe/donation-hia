import React, { FC } from "react";
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
import { HeartHandshake, SquarePen } from "lucide-react";
import Link from "next/link";

type ProjectProps = {
  item: ProjectWithTotalModel;
  orgId: string;
};

const ProjectItem: FC<ProjectProps> = ({ item, orgId }) => {
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
        <div className="flex flex-1 gap-2 justify-end">
          <Button variant={"outline"}>
            <SquarePen /> Edit
          </Button>
          <Link href={`/${orgId}/projects/${item.id}/transactions`}>
            <Button variant={"outline"}>
              <SquarePen /> View
            </Button>
          </Link>
          <Link href={`/${orgId}/projects/${item.id}/search-member`}>
            <Button variant={"outline"}>
              <HeartHandshake /> Donate
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectItem;
