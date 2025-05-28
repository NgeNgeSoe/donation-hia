"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const AuthLink = () => {
  const { data: session } = useSession();
  if (session?.user) return null;

  return (
    <>
      <div>
        <Link href={`/auth/register`}>register</Link>
      </div>
      <div>
        <Link href={`/auth/login`}>Login</Link>
      </div>
    </>
  );
};

export default AuthLink;
