"use server";

import { prisma } from "@/lib/prisma";
import { NewCurrencySchema } from "@/schemas";
import { z } from "zod";
import { getPersonByUserId } from "./auth_actions";
import { Prisma } from "@prisma/client";
import { promises } from "dns";

const addCurrency = async (
  data: z.infer<typeof NewCurrencySchema>,
  orgId: string,
  userId: string
) => {
  try {
    const person = await getPersonByUserId(userId);
    console.log("person", person);
    console.log("orgID", orgId);
    const newCurrency = await prisma.currency.create({
      data: {
        name: data.name,
        symbol: data.symbol,
        code: data.code,
        default: data.default,
        organizationId: orgId,
        createdById: person?.id!,
      },
    });
    return newCurrency;
  } catch (error) {
    console.error("error occuring in server", error);
    return null;
  }
};

export type CurrencyWithCreatedBy = Prisma.CurrencyGetPayload<{
  include: {
    createdBy: true;
  };
}>;

const getActiveCurrecnyByOrgID = async (
  organizationId: string
): Promise<CurrencyWithCreatedBy[] | null> => {
  try {
    const currencies = await prisma.currency.findMany({
      where: {
        active: true,
        organizationId,
      },
      include: {
        createdBy: true,
      },
    });
    return currencies;
  } catch (error) {
    console.error("error occring fetching org currency", error);
    return null;
  }
};

export { addCurrency, getActiveCurrecnyByOrgID };
