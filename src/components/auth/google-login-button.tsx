"use client";
import React from "react";
import { useActionState } from "react";
import { BsGoogle } from "react-icons/bs";
import { Button } from "../ui/button";
import { googleLogin } from "@/actions/register_action";

const GoogleLoginButton = () => {
  const [errorMsgGoogle, dispatchGoogle] = useActionState(
    googleLogin,
    undefined
  );

  return (
    <form className="flex mt-4" action={dispatchGoogle}>
      <Button
        variant={"outline"}
        className="flex flex-row items-center gap-3 w-fit"
      >
        <BsGoogle className="text-2xl" />
        <span>Sign in with Google</span>
      </Button>
      <p>{errorMsgGoogle}</p>
    </form>
  );
};

export default GoogleLoginButton;
