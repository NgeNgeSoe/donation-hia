import { getPhotos } from "@/actions/project_actions";
import NewPhotoForm from "@/components/project/new-photo-form";
import React from "react";

type PageProps = {
  params: Promise<{
    id: string;
    projId: string;
  }>;
};

const PhotoPage = async ({ params }: PageProps) => {
  const { projId, id } = await params;
  const photos = await getPhotos(projId);
  return (
    <div>
      <NewPhotoForm projectId={projId} orgId={id} photos={photos ?? []} />
    </div>
  );
};

export default PhotoPage;
