import LogoutButton from "@/components/auth/logout-button";
import { auth } from "@/lib/auth";
import React from "react";

const Dashboard = async () => {
  const session = await auth();
  console.log("Session", session);
  return (
    <div>
      Dashboard
      <LogoutButton />
    </div>
  );
};

export default Dashboard;
