"use server";

import { prisma } from "@/lib/prisma";
import { NewPhotoFormSchema, NewProjectSchema } from "@/schemas";
import { ProjectWithTotalModel } from "@/types";
import { TransactionType } from "@prisma/client";
import { z } from "zod";
import { getPersonByUserId } from "./auth_actions";
import path from "path";
import { promises as fs } from "fs";

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
    console.error("error occur getting project", error);
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
    if (!createdBy) {
      throw new Error("not found person by user id");
    }

    const newProject = await prisma.project.create({
      data: {
        description: data.description,
        location: data.location,
        createdAt: new Date(),
        createdById: createdBy?.id,
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
    console.error("error occur updating project", error);
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

const addPhoto = async (
  data: z.infer<typeof NewPhotoFormSchema>,
  userId: string
) => {
  try {
    const createdBy = await getPersonByUserId(userId);
    if (!createdBy) {
      throw new Error("not found person by user id");
    }

    if (data.imgUrl) {
      let fileName = data.imgUrl.name;
      const filePath = path.join(process.cwd(), "public", "img", fileName);
      try {
        await fs.stat(filePath);
        //if file exist rename
        const timestamp = Date.now();
        fileName = `${timestamp}-${data.imgUrl.name}`;
      } catch (error) {
        // throws an error if the file doesn't exist,
        console.error(error);
      }

      const temp_data = await data.imgUrl.arrayBuffer();
      await fs.writeFile(
        `${process.cwd()}/public/img/${fileName}`,
        Buffer.from(temp_data)
      );

      const photo = await prisma.gallery.create({
        data: {
          projectId: data.projectId,
          imageUrl: fileName,
          createdById: createdBy.id,
        },
      });
      return photo;
    } else {
      throw new Error("error occur checking file control have data or not");
    }
  } catch (error) {
    console.error("error occur adding photo", error);
    return null;
  }
};

const getPhotos = async (projectId: string) => {
  try {
    const photos = await prisma.gallery.findMany({
      where: {
        projectId,
      },
    });
    return photos;
  } catch (error) {}
};

export {
  getProjects,
  getProjectById,
  addProject,
  deleteProject,
  updateProject,
  addPhoto,
  getPhotos,
};
