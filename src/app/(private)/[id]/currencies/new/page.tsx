import CurrencyForm from "@/components/organization/currency-form";
import { Label } from "@/components/ui/label";
import React from "react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};
const NewCurrencyPage = async ({ params }: PageProps) => {
  const { id } = await params;
  console.log("params", id);

  return (
    <div>
      <Label className="text-xl">New Currency</Label>
      <CurrencyForm orgId={id} />
    </div>
  );
};

export default NewCurrencyPage;
