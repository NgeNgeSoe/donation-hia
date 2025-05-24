import { getProjects } from "@/actions/project_actions";
import ProjectItem from "@/components/project/project-item";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { FC } from "react";

type PageProps = {
  params: {
    id: string;
  };
};

const ProjectPage: FC<PageProps> = async ({ params }) => {
  const { id } = params;

  const projects = await getProjects(id);
  console.log(projects);
  return (
    <div className="m-4">
      Project page
      <br />
      <br />
      <Link href={`/${id}/projects/new`}>+ New Project</Link>
      <div>
        <h2 className="text-lg my-3 font-bold">Current Projects</h2>
        <div className="flex gap-5">
          {projects?.current &&
            projects.current.map((proj) => (
              <ProjectItem key={proj.id} item={proj} orgId={id} />
            ))}
        </div>
      </div>
      <div className="my-5">
        <h2 className="text-lg my-3 font-bold">Completed Projects</h2>
        <div className="flex gap-5">
          {projects?.completed &&
            projects.completed.map((proj) => (
              <ProjectItem key={proj.id} item={proj} orgId={id} />
            ))}
          {projects?.completed.length === 0 && (
            <Label>No completed project!</Label>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
