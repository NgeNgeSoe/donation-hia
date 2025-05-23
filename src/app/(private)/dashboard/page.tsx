import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();
  console.log("session", session);

  if (!session?.user.orgId) {
    redirect("/organization/new");
  }

  return <div>dashboard</div>;
};

export default page;
