"use client";
import React, { FC, useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { getMembersByTerms } from "@/actions/party_actions";
import { Person } from "@prisma/client";
import MemberTable from "../organization/member-table";

type SerachBoxProps = {
  orgId: string;
  projectId: string;
};

const SearBox: FC<SerachBoxProps> = ({ orgId, projectId }) => {
  const [str, setStr] = useState<string>("");
  const [members, setMembers] = useState<Person[] | null>(null);
  const [isPending, startTransaction] = useTransition();

  const handleSearch = () => {
    startTransaction(async () => {
      const temp = await getMembersByTerms(orgId, str);
      console.log("members", temp);
      setMembers(temp);
    });
  };

  return (
    <div>
      <Input
        type="text"
        placeholder="enter name"
        value={str}
        onChange={(e) => setStr(e.target.value)}
      />
      <Button variant={"outline"} onClick={handleSearch}>
        Search
      </Button>
      {isPending ? <p>...loading</p> : null}
      {members && members.length > 0 && (
        <MemberTable
          data={members}
          url={`/${orgId}/projects/${projectId}/income/new`}
        />
      )}
      {members && members.length === 0 && <p>no memebers found</p>}
    </div>
  );
};

export default SearBox;
