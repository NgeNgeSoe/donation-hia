"use client";
import { logout } from "@/actions/register_action";
import React, { useActionState } from "react";
import { Button } from "../ui/button";

const LogoutButton = () => {
  const [dispatchLogout] = useActionState(logout, undefined);
  return (
    <form action={dispatchLogout}>
      <Button
        variant={"outline"}
        className="flex flex-row items-center gap-3 w-fit"
      >
        <span>Log out</span>
      </Button>
    </form>
  );
};

export default LogoutButton;
