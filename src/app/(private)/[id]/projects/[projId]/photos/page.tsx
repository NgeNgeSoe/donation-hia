import { getPhotos } from "@/actions/project_actions";
import NewPhotoForm from "@/components/project/new-photo-form";
import React, { FC } from "react";

type PageProps = {
  params: {
    id: string;
    projId: string;
  };
};

const PhotoPage: FC<PageProps> = async ({ params }) => {
  const { id, projId } = await params;

  const photos = await getPhotos(projId);

  return (
    <div>
      <NewPhotoForm projectId={projId} orgId={id} photos={photos ?? []} />
    </div>
  );
};

export default PhotoPage;
