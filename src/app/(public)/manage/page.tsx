import SelectRegType from "@/components/auth/select-reg-type";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const MangeRoutePage = async () => {
  const session = await auth();
  console.log("manage", session);

  if (session?.user.orgId) {
    redirect("/dashboard");
  } else {
    console.log("no session", session);
  }

  return (
    <div className="flex justify-center">
      <SelectRegType />
    </div>
  );
};

export default MangeRoutePage;
