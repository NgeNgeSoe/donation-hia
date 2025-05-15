import { auth } from "@/lib/auth";
import React from "react";

const Dashboard = async () => {
  const session = await auth();
  console.log("Session", session);
  return <div>Dashboard</div>;
};

export default Dashboard;
