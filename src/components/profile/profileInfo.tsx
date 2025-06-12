"use client";
import React, { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Person } from "@prisma/client";
import Image from "next/image";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";

type props = {
  person: Person;
};
const ProfileInfo: FC<props> = ({ person }) => {
  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle className="text-xl">Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col my-5 items-center">
          <div className="relative w-32 h-32">
            <Image
              src="/img/avatar.png"
              alt="Profile picture"
              layout="fill"
              objectFit="cover"
              style={{ borderRadius: "50%" }}
            />
          </div>
        </div>
        <div className="flex flex-col my-5">
          <label className="text-gray-400 text-sm">Full Name</label>
          <label className="text-lg">{person.fullName}</label>
        </div>
        <div className="flex flex-col my-5">
          <label className="text-gray-400 text-sm">Gender</label>
          <label className="text-lg">{person.gender}</label>
        </div>
        <div className="flex flex-col my-5">
          <label className="text-gray-400 text-sm">Mobile Number</label>
          <label className="text-lg">{person.phone}</label>
        </div>
        <div className="flex flex-col my-5">
          <label className="text-gray-400 text-sm">Nickname</label>
          <label className="text-lg">{person.nickName}</label>
        </div>
        <div className="flex flex-col my-5">
          <label className="text-gray-400 text-sm">Member Since</label>
          <label className="text-lg">
            {person.fromDate.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </label>
        </div>
        <div className="flex flex-col my-5">
          <Link href={`/profile/edit/${person.id}`} className="w-full">
            <Button variant={"outline"} className="w-full">
              <Edit />
              Edit Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
