"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NewOrganizationSchema, NewPersonSchema } from "@/schemas";
import { PartyType } from "@prisma/client";
import { z } from "zod";

const addOrganization = async (data: z.infer<typeof NewOrganizationSchema>) => {
  try {
    const validatedData = await NewOrganizationSchema.safeParseAsync(data);
    if (!validatedData.success) {
      return {
        error: "Invalid data",
      };
    }
    // create party
    const party = await prisma.party.create({
      data: {
        partyType: PartyType.ORGANIZATION,
      },
    });

    const organization = await prisma.organization.create({
      data: {
        id: party.id,
        name: data.name,
        description: data.description ?? "",
        logoUrl: data.logo ?? "",
      },
    });

    return organization;
  } catch (error) {
    console.error("Error creating organization:", error);
    return null;
  }
};

const addPerson = async (
  data: z.infer<typeof NewPersonSchema>,
  orgId: string
) => {
  try {
    const party = await prisma.party.create({
      data: {
        partyType: PartyType.PERSON,
        person: {
          create: {
            fullName: data.fullName,
            phone: data.phone,
            member: data.member,
            nickName: data.nickName ?? "",
            gender: data.gender,
            fromDate: data.fromDate ?? new Date(),
            thruDate: data.thruDate,
          },
        },
      },
      include: {
        person: true,
      },
    });

    //add organization person
    const org_person = await prisma.organizationPerson.create({
      data: {
        organizationId: orgId,
        personId: party.id,
      },
    });

    return party.person;
  } catch (error) {
    console.error("Error creating person:", error);

    return null;
  }
};

const addUserPerson = async (partyId: string) => {
  try {
    const session = await auth();
    const userPerson = await prisma.userPerson.create({
      data: {
        userId: session?.user.id!,
        personId: partyId,
      },
    });

    return userPerson;
  } catch (error) {
    console.error("Error creating userPerson", error);
  }
};

const addPersonRole = async (
  organizationId: string,
  roleId: string,
  personId: string,
  userId: string
) => {
  try {
    console.log("run server addpersonrole");
    const userperson = await prisma.userPerson.findUnique({
      where: {
        userId,
      },
    });

    const personRole = await prisma.personRole.create({
      data: {
        personId,
        roleId,
        organizationId,
        createdById: userperson?.personId!,
      },
    });
    return personRole;
  } catch (error) {
    console.log("error creating person role", error);
  }
};

const getRoleByTerms = async (terms: string) => {
  try {
    const role = await prisma.role.findFirst({
      where: {
        name: "admin",
      },
    });

    return role;
  } catch (error) {
    console.error("error getting  admin role", error);
  }
};

const getMemberByOrganizationId = async (orgId: string) => {
  try {
    const result = await prisma.organizationPerson.findMany({
      where: {
        organizationId: orgId,
        person: {
          party: {
            active: true,
          },
        },
      },
      include: {
        person: true,
      },
    });

    return result.map((org) => org.person);
  } catch (error) {
    console.error("error occuring get members server action");
  }
};

const getMembersByTerms = async (orgId: string, str: string) => {
  try {
    console.log("orgId", orgId);
    const members = await prisma.person.findMany({
      where: {
        party: {
          active: true,
        },
        organizationPersons: {
          some: {
            organizationId: orgId,
          },
        },
        member: true,
        OR: [
          { fullName: { contains: str, mode: "insensitive" } },
          { nickName: { contains: str, mode: "insensitive" } },
        ],
      },
    });
    return members;
  } catch (error) {
    console.error("error occuring search member");
    return null;
  }
};

const getDefault_Org_Currency = async (orgId: string) => {
  try {
    const default_currency = await prisma.currency.findFirst({
      where: {
        organizationId: orgId,
        default: true,
      },
    });
    return default_currency;
  } catch (error) {
    console.error("error occuring get default org currency");
    return null;
  }
};

export {
  addOrganization,
  addPerson,
  addUserPerson,
  addPersonRole,
  getRoleByTerms,
  getMemberByOrganizationId,
  getMembersByTerms,
  getDefault_Org_Currency,
};
