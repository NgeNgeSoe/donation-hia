"use server";
import { prisma } from "@/lib/prisma";
import {
  MemberDonationSchema,
  NewExpenseSchema,
  NewIncomeSchema,
  NewTransferSchema,
} from "@/schemas";
import { z } from "zod";
import { getPersonByUserId } from "./auth_actions";
import { promises as fs } from "fs";
import path from "path";
import { PayType } from "@/types";

const addIncome = async (
  data: z.infer<typeof NewIncomeSchema>,
  userId: string
) => {
  try {
    const createdBy = await getPersonByUserId(userId);
    if (!createdBy) {
      throw new Error("no found person by userId");
    }
    const income = await prisma.$transaction(async (prisma) => {
      const trans = await prisma.transaction.create({
        data: {
          type: "INCOME",
          createdAt: new Date(),
          projectId: data.projectId,
          transactionDate: data.transactionDate,
          currencyId: data.currencyId,
          createdById: createdBy?.id,
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
        } catch {
          // throws an error if the file doesn't exist,
          // console.error(error);
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
        transaction: true,
      },
    });
    return incomes;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const addExpense = async (
  data: z.infer<typeof NewExpenseSchema>,
  userId: string
) => {
  try {
    const createdBy = await getPersonByUserId(userId);
    if (!createdBy) {
      throw new Error("not found person by user id");
    }
    const expense = await prisma.$transaction(async (prisma) => {
      const trans = await prisma.transaction.create({
        data: {
          type: "EXPENSE",
          createdAt: new Date(),
          projectId: data.projectId,
          transactionDate: data.transactionDate,
          currencyId: data.currencyId,
          createdById: createdBy?.id,
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
        } catch {
          //throw error;
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
    console.error(error);
    return null;
  }
};

const addTransfer = async (
  data: z.infer<typeof NewTransferSchema>,
  userId: string
) => {
  try {
    const createdBy = await getPersonByUserId(userId);
    if (!createdBy) {
      throw new Error("no person found by userId");
    }
    const transfer = await prisma.$transaction(async (prisma) => {
      const trans = await prisma.transaction.create({
        data: {
          type: "TRANSFER",
          createdAt: new Date(),
          projectId: data.fromProjectId,
          transactionDate: data.transactionDate,
          currencyId: data.currencyId,
          createdById: createdBy?.id,
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
    console.error(error);
    return null;
  }
};

const addDonation = async (data: z.infer<typeof MemberDonationSchema>) => {
  try {
    //condtional create transaction image if imgUrl exists
    let fileName = "";
    if (data.imgUrl) {
      fileName = data.imgUrl.name;

      const filePath = path.join(process.cwd(), "public", "img", fileName);
      try {
        await fs.stat(filePath);
        const timestamp = Date.now();
        fileName = `${timestamp}-${data.imgUrl.name}`;
      } catch {
        //throw error;
      }
      const temp_data = await data.imgUrl.arrayBuffer();
      await fs.writeFile(
        `${process.cwd()}/public/img/${fileName}`,
        Buffer.from(temp_data)
      );
    }

    const donation = await prisma.donation.create({
      data: {
        personId: data.memberId,
        amount: data.amount,
        imageUrl: fileName,
        receiptNumber: data.refNumber ?? "",
        projectId: data.projectId,
      },
    });
    return { ...donation, amount: donation.amount.toNumber() };
  } catch (error) {
    console.error("Error adding doantion record to db:", error);
    return null;
  }
};
const getDonationByPersonId = async (userId: string) => {
  try {
    const member = await getPersonByUserId(userId);
    if (!member) {
      throw new Error("no person found by userId");
    }
    const donations = await prisma.donation.findMany({
      where: {
        personId: member.id,
      },
      include: {
        project: true,
      },
    });
    return donations;
  } catch (error) {
    console.error(error);
    return null;
  }
};
const getIncomeByPersonId = async (userId: string) => {
  try {
    const member = await getPersonByUserId(userId);
    if (!member) {
      throw new Error("no person found by userId");
    }
    const incomes = await prisma.income.findMany({
      where: {
        memberId: member.id,
      },
      include: {
        transaction: {
          include: {
            project: true,
          },
        },
      },
    });
    return incomes;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getAllDonationRecords = async () => {
  try {
    const donations = await prisma.donation.findMany({
      include: {
        project: true,
      },
    });
    return donations;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const approveDonationRecord = async (donationId: string, userId: string) => {
  try {
    const createdBy = await getPersonByUserId(userId);
    if (!createdBy) {
      throw new Error("no found person by userId");
    }

    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        project: true,
      },
    });

    const defaultCurrency = await prisma.currency.findFirst({
      where: {
        organizationId: donation?.project?.organizationId,
        default: true,
      },
    });

    if (!donation) {
      throw new Error("Donation record not found");
    }
    // Create transaction and income in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create transaction (type: INCOME)
      if (!defaultCurrency || typeof defaultCurrency.id !== "number") {
        throw new Error("Default currency not found or invalid");
      }
      const transaction = await prisma.transaction.create({
        data: {
          type: "INCOME",
          createdAt: new Date(),
          projectId: donation.projectId,
          transactionDate: donation.createdAt,
          currencyId: defaultCurrency.id,
          createdById: createdBy.id,
        },
      });
      // Create income record linked to transaction and person
      const income = await prisma.income.create({
        data: {
          id: transaction.id,
          memberId: donation.personId,
          amount: donation.amount,
          remark: donation.receiptNumber || "Donation approved.",
          payType: PayType.OTHERS, // or another value if you have enum
        },
      });

      if (donation.imageUrl && donation.imageUrl.trim() !== "") {
        // Save the image URL if it exists
        await prisma.transactionFile.create({
          data: {
            transactionId: transaction.id,
            imageUrl: donation.imageUrl,
          },
        });
      }

      // Delete the donation after transferring data
      await prisma.donation.delete({
        where: { id: donationId },
      });
      return true;
    });
    return result;
  } catch (error) {
    console.error("Error approving donation record:", error);
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
  addDonation,
  getIncomeByPersonId,
  getDonationByPersonId,
  getAllDonationRecords,
  approveDonationRecord,
};
