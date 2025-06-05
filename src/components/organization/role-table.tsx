"use client";
import React, { useEffect, useState, useTransition } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useSearchParams } from "next/navigation";
import {
  getPersonById,
  getPersonRoels,
  savePersonRoles,
} from "@/actions/party_actions";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import Link from "next/link";

type Props = {
  roles: string[];
  orgId: string;
};

const RoleTable = ({ roles, orgId }: Props) => {
  const params = useSearchParams();
  const memberId = params.get("mid");
  const { data: session } = useSession();

  const [personRoles, setPersonRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [member, setMember] = useState("");

  useEffect(() => {
    if (!memberId) return;
    const fetch = async () => {
      const userRoles = await getPersonRoels(memberId);
      setPersonRoles(userRoles ?? []);

      const temp = await getPersonById(memberId);

      setMember(temp?.fullName ?? "Member not found");

      setLoading(false);
    };

    fetch();
  }, [memberId]);

  if (!session?.user || !memberId) {
    return <p>no login user or invalid member</p>;
  }

  if (loading) return <p>Loading roles...</p>;

  const handleRoleToggle = (role: string) => {
    setPersonRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSave = () => {
    try {
      startTransition(async () => {
        const result = await savePersonRoles(
          memberId,
          personRoles,
          session.user.id,
          orgId
        );
        if (result) {
          //
        } else {
          throw new Error("Error occur saving roles for member");
        }
      });
      // save roles
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <Card className="w-1/2">
      <CardContent>
        <Label className="text-xl">{member}&apos;s Roles</Label>
        {roles &&
          roles.map((element, index) => {
            const status = personRoles.find((x) => x === element);
            return (
              <RenderRole
                key={index}
                role={element}
                status={status ? true : false}
                onToggle={handleRoleToggle}
              />
            );
          })}
      </CardContent>
      <CardFooter>
        <div className="flex gap-3">
          <Button variant={"outline"} onClick={handleSave}>
            {isPending && <Loader />}
            Save
          </Button>
          <Link href={`/${orgId}/members`}>
            <Button variant={"secondary"}>Back</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
const RenderRole = ({
  role,
  status,
  onToggle,
}: {
  role: string;
  key: number;
  status: boolean;
  onToggle: (role: string) => void;
}) => (
  <div className="flex gap-2 my-3 items-center">
    <Checkbox
      value={role}
      checked={status}
      onCheckedChange={() => onToggle(role)}
    />
    <Label>{role}</Label>
  </div>
);

export default RoleTable;
