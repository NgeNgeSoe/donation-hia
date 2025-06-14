import React from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Label } from "../ui/label";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { getLast12Projects } from "@/actions/project_actions";

const DonationInfoItem = async () => {
  const projects = (await getLast12Projects()) ?? [];
  console.log("projects", projects);
  if (!projects || projects.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center h-64">
          <Label className="text-gray-500">No recent projects available.</Label>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {projects.map((project) => (
        <React.Fragment key={project.id}>
          <Card className="w-full">
            <CardContent className="flex gap-4">
              <div>
                {project.galleries && project.galleries.length > 0 ? (
                  <Image
                    src={`/img/${project.galleries[0].imageUrl}`}
                    width={230}
                    height={230}
                    alt="img"
                  />
                ) : (
                  <Image
                    src="/Rice-Porridge.jpg"
                    width={230}
                    height={230}
                    alt="img"
                  />
                )}
              </div>
              <div className="flex flex-col gap-6">
                <Label>{project.description}</Label>
                <div className="flex gap-2">
                  <MapPin size={20} />
                  <Label>{project.location}</Label>
                </div>
                <div className="flex gap-2">
                  <Calendar size={20} />
                  <Label>
                    {project.from
                      ? project.from
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "2-digit",
                          })
                          .replace(/\s/g, " ")
                      : ""}{" "}
                    -{" "}
                    {project.to
                      ? project.to
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "2-digit",
                          })
                          .replace(/\s/g, " ")
                      : ""}
                  </Label>
                </div>
                <div>
                  <Link href="#">
                    <button className="rounded-0 bg-indigo-600 px-15 py-3 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      Details More
                    </button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </React.Fragment>
      ))}
    </>
  );
};

export default DonationInfoItem;
