"use server";
import { prisma } from "@/lib/prisma";
import {
  NewExpenseSchema,
  NewIncomeSchema,
  NewTransferSchema,
} from "@/schemas";
import { string, z } from "zod";
import { getPersonByUserId } from "./auth_actions";
import { promises as fs } from "fs";
import path from "path";

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
      if (!!data.imgUrl) {
        //check file name exist
        let fileName = data.imgUrl.name;
        const filePath = path.join(process.cwd(), "public", "img", fileName);

        try {
          await fs.stat(filePath);
          //if file exist rename
          const timestamp = Date.now();
          fileName = `${timestamp}-${data.imgUrl.name}`;
        } catch (error) {
          // throws an error if the file doesn't exist,
        }

        const temp_data = await data.imgUrl.arrayBuffer();
        await fs.writeFile(
          `${process.cwd()}/public/img/${fileName}`,
          Buffer.from(temp_data)
        );

        await prisma.transactionFile.create({
          data: {
            transactionId: trans.id,
            imageUrl: fileName,
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
        let fileName = data.imgUrl.name;

        const filePath = path.join(process.cwd(), "public", "img", fileName);
        try {
          await fs.stat(filePath);
          const timestamp = Date.now();
          fileName = `${timestamp}-${data.imgUrl.name}`;
        } catch (error) {}
        const temp_data = await data.imgUrl.arrayBuffer();
        await fs.writeFile(
          `${process.cwd()}/public/img/${fileName}`,
          Buffer.from(temp_data)
        );

        await prisma.transactionFile.create({
          data: {
            transactionId: trans.id,
            imageUrl: fileName,
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

const addTransfer = async (
  data: z.infer<typeof NewTransferSchema>,
  userId: string
) => {
  try {
    const createdBy = await getPersonByUserId(userId);
    const transfer = await prisma.$transaction(async (prisma) => {
      const trans = await prisma.transaction.create({
        data: {
          type: "TRANSFER",
          createdAt: new Date(),
          projectId: data.fromProjectId,
          transactionDate: data.transactionDate,
          currencyId: data.currencyId,
          createdById: createdBy?.id!,
        },
      });
      const temp_transfer = await prisma.transfer.create({
        data: {
          id: trans.id,
          fromProjectId: data.fromProjectId,
          toProjectId: data.toProjectId,
          amount: data.amount,
        },
      });

      //condtional create transaction image if imgUrl exists

      return temp_transfer;
    });

    return { ...transfer, amount: transfer.amount.toNumber() }; // Ensure amount is a number
  } catch (error) {
    console.error("Error adding transfer record to db:", error);
    return null;
  }
};

const getTransfersByProjectId = async (projectId: string) => {
  try {
    const transfers = await prisma.transfer.findMany({
      where: {
        fromProjectId: projectId,
        transaction: {
          projectId,
        },
      },
      include: {
        fromProject: true,
        toProject: true,
      },
    });
    return transfers;
  } catch (error) {
    return null;
  }
};

export {
  addIncome,
  getIncomeByProjectId,
  addExpense,
  getExpenseByProjectId,
  addTransfer,
  getTransfersByProjectId,
};
