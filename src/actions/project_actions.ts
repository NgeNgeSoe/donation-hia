"use server";

import { prisma } from "@/lib/prisma";
import { NewProjectSchema } from "@/schemas";
import { GetProjectModel, ProjectWithTotalModel } from "@/types";
import { TransactionType } from "@prisma/client";
import { z } from "zod";
import { getPersonByUserId } from "./auth_actions";

const getProjects = async (organizationId: string) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); //settime to 00:00:00.000
    const currentProjects = await prisma.project.findMany({
      where: {
        organizationId,
      },
      select: {
        id: true,
        description: true,
        location: true,
        openingBalance: true,
        fromDate: true,
        thruDate: true,
      },
    });

    const temp_projects: ProjectWithTotalModel[] = await Promise.all(
      currentProjects.map(async (proj) => {
        const incomes = await prisma.income.findMany({
          where: {
            transaction: {
              projectId: proj.id,
              type: TransactionType.INCOME,
            },
          },
          select: {
            amount: true,
          },
        });

        const total = incomes.reduce(
          (sum, income) => sum + income.amount.toNumber(),
          0
        );

        return {
          id: proj.id,
          description: proj.description,
          location: proj.location,
          openingAmount: proj.openingBalance.toNumber(), // convert Decimal to number
          IncomeAmount: total,
          from: proj.fromDate,
          to: proj.thruDate, // fallback to a default Date if null
          // If you still want to keep 'total', you can add it as well
          // total,
        };
      })
    );

    const current = temp_projects.filter(
      (p) => p.from && p.from < today && p.to && p.to > today
    );

    const completed = temp_projects.filter((p) => p.to && p.to < today);

    return {
      current: current,
      completed: completed,
    };
  } catch (error) {
    console.error("error occuring fetching projects", error);
    return null;
  }
};

const addProject = async (
  data: z.infer<typeof NewProjectSchema>,
  organizationId: string,
  userId: string
) => {
  try {
    const createdBy = await getPersonByUserId(userId);

    const newProject = await prisma.project.create({
      data: {
        description: data.description,
        location: data.location,
        createdAt: new Date(),
        createdById: createdBy?.id!,
        fromDate: data.fromDate,
        thruDate: data.thruDate,
        organizationId,
        openingBalance: data.openingAmount,
      },
    });
    return {
      ...newProject,
      openingBalance: newProject.openingBalance.toNumber(),
    };
  } catch (error) {
    console.error("error occuring creating project", error);
  }
};

export { getProjects, addProject };
