import CurrencyForm from "@/components/organization/currency-form";
import { Label } from "@/components/ui/label";
import React, { FC } from "react";

type PageProps = {
  params: {
    id: string;
  };
};
const NewCurrencyPage: FC<PageProps> = async ({ params }) => {
  const { id } = await params;
  console.log("params", id);

  return (
    <div>
      <Label>New Currency</Label>
      <CurrencyForm orgId={id} />
    </div>
  );
};

export default NewCurrencyPage;
