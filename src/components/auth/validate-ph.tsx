"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { addUserPerson, getPersonByPhone } from "@/actions/party_actions";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { Person } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";

const ValidatePhone = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [ph, setPhone] = useState("");
  const [showPersonInfo, setShowPersonInfo] = useState(false);
  const [person, setPerson] = useState<Person | null>();

  const [isPending, startTransition] = useTransition();

  if (!session) {
    return <div>No login user found</div>;
  }

  const handleValidate = () => {
    //get person by ph
    startTransition(async () => {
      try {
        const tempPerson = await getPersonByPhone(ph);
        if (!tempPerson) {
          throw new Error("Result is null");
        }
        setShowPersonInfo(true);
        setPerson(tempPerson);
      } catch (error) {
        console.error(error);
      }
    });
  };

  const onHandleConfirmed = () => {
    if (person) {
      startTransition(async () => {
        try {
          Promise.all([
            
          ])
          const result = await addUserPerson(person.id, session?.user.id);
          console.log("result", result);
          if (result) {
            router.push("/dashboard");
          } else {
            throw new Error("return reuslt is null");
          }
        } catch (error) {
          console.error(error);
        }
      });
      return;
    }
    console.log(`no person found`);
    return;
  };

  return (
    <>
      {showPersonInfo ? (
        <Card>
          <CardHeader>
            <CardTitle>Your info</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>FullName : {person?.fullName}</Label>
            <Label>nickName : {person?.nickName}</Label>
            <Label>gender : {person?.gender}</Label>
          </CardContent>
          <CardFooter>
            <Button variant={"outline"} onClick={onHandleConfirmed}>
              Confirmed
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Enter phone number to validate Member or not</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input
              placeholder="enter phone number"
              value={ph}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button variant={"outline"} onClick={handleValidate}>
              {isPending && <Loader />} Validate Phone
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ValidatePhone;
