import { getActiveCurrecnyByOrgID } from "@/actions/config_actions";
import NewExpenseForm from "@/components/transaction/new-expense-form";
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

const NewExpensePage: FC<PageProps> = async ({ params }) => {
  const { id, projId } = await params;
  const currencies = await getCurrencies(id);
  return (
    <div>
      <NewExpenseForm currencies={currencies} projectId={projId} orgId={id} />
    </div>
  );
};

export default NewExpensePage;
