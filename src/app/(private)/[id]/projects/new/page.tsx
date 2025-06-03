import NewProjectForm from "@/components/project/new-project-form";
import React, { FC } from "react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const NewProjectPage: FC<PageProps> = async ({ params }) => {
  const { id } = await params;
  return (
    <div>
      <NewProjectForm orgId={id} />
    </div>
  );
};

export default NewProjectPage;
