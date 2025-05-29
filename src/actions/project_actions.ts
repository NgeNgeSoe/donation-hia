"use server";

import { prisma } from "@/lib/prisma";
import { NewProjectSchema } from "@/schemas";
import { ProjectWithTotalModel } from "@/types";
import { TransactionType } from "@prisma/client";
import { z } from "zod";
import { getPersonByUserId } from "./auth_actions";
import { LucideNewspaper } from "lucide-react";

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
      //(p) => p.from && p.from < today && p.to && p.to > today
      (p) => p.to && p.to > today
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
const getProjectById = async (id: string) => {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    return {
      id: project?.id,
      description: project?.description,
      location: project?.location,
      from: project?.fromDate,
      to: project?.thruDate,
      openingAmount: project?.openingBalance.toNumber(),
    } as ProjectWithTotalModel;
  } catch (error) {
    console.error("error occur getting project");
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

const updateProject = async (
  id: string,
  data: z.infer<typeof NewProjectSchema>
) => {
  try {
    const updated = await prisma.project.update({
      where: {
        id,
      },
      data: {
        description: data.description,
        location: data.location,
        fromDate: data.fromDate,
        thruDate: data.thruDate,
        openingBalance: data.openingAmount,
      },
    });
    return {
      ...updated,
      openingBalance: updated.openingBalance.toNumber(),
    };
  } catch (error) {
    console.error("error occur updating project");
    return null;
  }
};

const deleteProject = async (id: string) => {
  try {
    await prisma.project.delete({
      where: {
        id: id,
      },
    });
    console.log("project is successfully delected.");
    return { success: true };
  } catch (error) {
    console.error("error occur deleting project", error);
    return { success: false, message: "Error occur deleting project." };
  }
};

export {
  getProjects,
  getProjectById,
  addProject,
  deleteProject,
  updateProject,
};
