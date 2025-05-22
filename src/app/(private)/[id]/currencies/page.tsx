import { getActiveCurrecnyByOrgID } from "@/actions/config_actions";
import CurrencyTable from "@/components/organization/currency-table";
import Link from "next/link";
import React, { FC } from "react";

type PageProps = {
  params: {
    id: string;
  };
};

const CurrencyPage: FC<PageProps> = async ({ params }) => {
  const { id } = await params;

  const currencies = await getActiveCurrecnyByOrgID(id);

  return (
    <div>
      <br />
      <br />
      <Link href={`/${id}/currencies/new`}>+ New Currency</Link>
      <br />
      <br />
      {currencies && <CurrencyTable data={currencies!} />}
      {!currencies && <h1>No record found!</h1>}
    </div>
  );
};

export default CurrencyPage;
