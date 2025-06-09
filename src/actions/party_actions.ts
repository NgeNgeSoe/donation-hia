"use server";

import { prisma } from "@/lib/prisma";
import { NewOrganizationSchema, NewPersonSchema } from "@/schemas";
import { PartyType, PersonRole } from "@prisma/client";
import { z } from "zod";
import { getPersonByUserId } from "./auth_actions";

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
    await prisma.organizationPerson.create({
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
const updatePerson = async (
  id: string,
  data: z.infer<typeof NewPersonSchema>
) => {
  try {
    const updated = await prisma.person.update({
      where: { id },
      data: {
        fullName: data.fullName,
        nickName: data.nickName ?? "N/A",
        phone: data.phone,
        member: data.member,
        gender: data.gender,
        fromDate: data.fromDate!,
        thruDate: data.thruDate,
      },
    });
    return updated;
  } catch (error) {
    console.error("error occured update member", error);
    return null;
  }
};
const getPersonById = async (id: string) => {
  try {
    const person = await prisma.person.findUnique({
      where: {
        id,
      },
    });
    return person;
  } catch (error) {
    console.error("error occur getting person", error);
    return null;
  }
};

const addUserPerson = async (partyId: string, userId: string) => {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   throw new Error("session user not found");
    // }
    const userPerson = await prisma.userPerson.create({
      data: {
        userId: userId,
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
    if (!userperson) {
      throw new Error("no user person by user id");
    }
    const personRole = await prisma.personRole.create({
      data: {
        personId,
        roleId,
        organizationId,
        createdById: userperson?.personId,
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
        name: terms,
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
    console.error("error occuring get members server action", error);
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
    console.error("error occuring search member", error);
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
    console.error("error occuring get default org currency", error);
    return null;
  }
};

const getPersonRoels = async (memberId: string) => {
  try {
    const personRoles = await prisma.personRole.findMany({
      where: {
        personId: memberId,
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    return personRoles.map((pr) => pr.role.name);
  } catch (error) {
    console.error("error occur getting user roles", error);
    return null;
  }
};

const savePersonRoles = async (
  personId: string,
  roles: string[],
  userId: string,
  orgId: string
) => {
  try {
    const createdBy = await getPersonByUserId(userId);
    if (!createdBy) {
      throw new Error("no found person by userId");
    }

    //delete all personroles
    await prisma.personRole.deleteMany({
      where: {
        personId: personId,
      },
    });

    const roleRecords = await prisma.role.findMany({
      where: {
        name: { in: roles },
      },
      select: { id: true },
    });

    const data = roleRecords.map(
      (r) =>
        ({
          personId,
          roleId: r.id,
          organizationId: orgId,
          createdById: createdBy.id,
        } as PersonRole)
    );

    await prisma.personRole.createMany({
      data,
      skipDuplicates: true,
    });
    return true;
  } catch (error) {
    console.error("Error saving person roles:", error);
    return false;
  }
};

const getPersonByPhone = async (ph: string) => {
  try {
    const person = await prisma.person.findFirst({
      where: {
        phone: ph,
      },
    });
    if (!person) {
      throw new Error("Not found person by phone");
    }
    return person;
  } catch (error) {
    console.error("error occur getting person by phone", error);
    return null;
  }
};

export {
  addOrganization,
  addPerson,
  getPersonById,
  updatePerson,
  addUserPerson,
  addPersonRole,
  getRoleByTerms,
  getMemberByOrganizationId,
  getMembersByTerms,
  getDefault_Org_Currency,
  getPersonRoels,
  savePersonRoles,
  getPersonByPhone,
};
