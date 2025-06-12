import { getPersonByUserId } from "@/actions/auth_actions";
import ProfileInfo from "@/components/profile/profileInfo";
import { auth } from "@/lib/auth";
import React from "react";

const ProfilePage = async () => {
  const session = await auth();
  if (!session) {
    return <div>Please log in to view your profile.</div>;
  }

  const personInfo = await getPersonByUserId(session.user.id);
  if (!personInfo) {
    return <div>No profile information found.</div>;
  }

  return (
    <div>
      <ProfileInfo person={personInfo} />
    </div>
  );
};

export default ProfilePage;
