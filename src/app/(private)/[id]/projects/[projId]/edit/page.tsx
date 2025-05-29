import { getProjectById } from "@/actions/project_actions";
import NewProjectForm from "@/components/project/new-project-form";
import React, { FC } from "react";

type PageProps = {
  params: {
    id: string;
    projId: string;
  };
};

const EditProjectPage: FC<PageProps> = async ({ params }) => {
  const { id, projId } = await params;
  const project = await getProjectById(projId);
  if (!project) {
    return <div>no project found by id</div>;
  }

  return (
    <div>
      <NewProjectForm orgId={id} project={project} />
    </div>
  );
};

export default EditProjectPage;
