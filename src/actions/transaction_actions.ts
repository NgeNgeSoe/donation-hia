"use server";
import { prisma } from "@/lib/prisma";
import { NewExpenseSchema, NewIncomeSchema } from "@/schemas";
import { z } from "zod";
import { getPersonByUserId } from "./auth_actions";
import { getDefault_Org_Currency } from "./party_actions";

const addIncome = async (
  data: z.infer<typeof NewIncomeSchema>,
  userId: string
) => {
  try {
    const createdBy = await getPersonByUserId(userId);
    const income = await prisma.$transaction(async (prisma) => {
      const trans = await prisma.transaction.create({
        data: {
          type: "INCOME",
          createdAt: new Date(),
          projectId: data.projectId,
          transactionDate: data.transactionDate,
          currencyId: data.currencyId,
          createdById: createdBy?.id!,
        },
      });
      const temp_income = await prisma.income.create({
        data: {
          id: trans.id,
          memberId: data.memberId,
          amount: data.amount,
          remark: data.remark ?? "",
          payType: data.payType,
        },
      });
      //condtional create transaction image if imgUrl exists
      if (data.imgUrl) {
        await prisma.transactionFile.create({
          data: {
            transactionId: trans.id,
            imageUrl: data.imgUrl,
          },
        });
      }
      return temp_income;
    });

    return { ...income, amount: income.amount.toNumber() }; // Ensure amount is a number
  } catch (error) {
    console.error("Error adding income record to db:", error);
    return null;
  }
};

const getIncomeByProjectId = async (projectId: string) => {
  try {
    const incomes = await prisma.income.findMany({
      where: {
        transaction: {
          projectId: projectId,
        },
      },
      include: {
        member: true,
      },
    });
    return incomes;
  } catch (error) {
    return null;
  }
};

const addExpense = async (
  data: z.infer<typeof NewExpenseSchema>,
  userId: string
) => {
  try {
    const createdBy = await getPersonByUserId(userId);
    const expense = await prisma.$transaction(async (prisma) => {
      const trans = await prisma.transaction.create({
        data: {
          type: "EXPENSE",
          createdAt: new Date(),
          projectId: data.projectId,
          transactionDate: data.transactionDate,
          currencyId: data.currencyId,
          createdById: createdBy?.id!,
        },
      });
      const temp_expense = await prisma.expense.create({
        data: {
          id: trans.id,
          amount: data.amount,
          description: data.description ?? "",
        },
      });
      //condtional create transaction image if imgUrl exists
      if (data.imgUrl) {
        await prisma.transactionFile.create({
          data: {
            transactionId: trans.id,
            imageUrl: data.imgUrl,
          },
        });
      }
      return temp_expense;
    });

    return { ...expense, amount: expense.amount.toNumber() }; // Ensure amount is a number
  } catch (error) {
    console.error("Error adding income record to db:", error);
    return null;
  }
};

const getExpenseByProjectId = async (projectId: string) => {
  try {
    const expneses = await prisma.expense.findMany({
      where: {
        transaction: {
          projectId: projectId,
        },
      },
    });
    return expneses;
  } catch (error) {
    return null;
  }
};

export { addIncome, getIncomeByProjectId, addExpense, getExpenseByProjectId };
