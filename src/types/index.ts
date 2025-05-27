import { Income } from "@prisma/client";
import { string } from "zod";

export type GetProjectModel = {
  current: ProjectWithTotalModel[] | null;
  completed: ProjectWithTotalModel[] | null;
};

export type ProjectWithTotalModel = {
  id: string;
  description: string;
  location: string;
  openingAmount: number;
  IncomeAmount: number;
  from: Date;
  to: Date | null;
};

export type dropdownModel = {
  value: string;
  label: string;
};

export enum PayType {
  KPAY = "KPAY",
  AYAPAY = "AYAPAY",
  UABPAY = "UABPAY",
  CASH = "CASH",
  OTHERS = "OTHERS",
}

export type Column = {
  id: string;
  header: string;
};

export type IncomeWtihNumberAmount = Omit<Income, "amount"> & {
  amount: number;
  name: string;
  phone: string;
};
