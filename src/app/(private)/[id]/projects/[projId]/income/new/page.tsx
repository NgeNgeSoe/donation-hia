import { getActiveCurrecnyByOrgID } from "@/actions/config_actions";
import NewIncomeForm from "@/components/transaction/new-income-form";
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

const NewIncomePage: FC<PageProps> = async ({ params }) => {
  const { id, projId } = await params;
  const currencies = await getCurrencies(id);

  return (
    <div>
      <NewIncomeForm currencies={currencies} projectId={projId} orgId={id} />
    </div>
  );
};

export default NewIncomePage;
