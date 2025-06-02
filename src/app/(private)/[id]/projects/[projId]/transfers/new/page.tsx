import { getActiveCurrecnyByOrgID } from "@/actions/config_actions";
import { getProjects } from "@/actions/project_actions";
import NewTransferForm from "@/components/transaction/new-transfer-form";
import { dropdownModel } from "@/types";
import React, { FC } from "react";

const getCurrencies = async (orgId: string) => {
  const currencies = await getActiveCurrecnyByOrgID(orgId);
  const ddl: dropdownModel[] = (currencies ?? []).map((item) => ({
    label: item.symbol,
    value: String(item.id),
  }));

  return ddl;
};

type PageProps = {
  params: Promise<{
    id: string;
    projId: string;
  }>;
};

const NewTransfer: FC<PageProps> = async ({ params }) => {
  const { id, projId } = await params;
  const currencies = await getCurrencies(id);
  const all_projects = await getProjects(id);
  const toProjects =
    all_projects?.current
      .filter((proj) => proj.id !== projId)
      .map((e) => ({
        label: `${e.description}, ${
          e.location
        }(${e.from.toLocaleDateString()}-${e.to?.toLocaleDateString()})`,
        value: e.id,
      })) ?? [];

  const from_project = all_projects?.current.find((e) => e.id === projId);
  if (from_project === undefined) {
    return <div>From project does not exist! </div>;
  }

  return (
    <div>
      <NewTransferForm
        currencies={currencies}
        projectId={projId}
        orgId={id}
        toProjects={toProjects}
        fromProject={from_project}
      />
    </div>
  );
};

export default NewTransfer;
