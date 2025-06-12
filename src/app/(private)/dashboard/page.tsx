import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import * as React from "react";

const page = async () => {
  const session = await auth();
  if (!session?.user.orgId) {
    redirect("/manage");
  }

  return <div>dashboard</div>;
};

export default page;
