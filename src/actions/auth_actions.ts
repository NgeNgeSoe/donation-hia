import { prisma } from "@/lib/prisma";

const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};

const getAccountByUserId = async (userId: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        userId,
      },
    });
    return account;
  } catch (error) {
    console.error("Error fetching account by user ID:", error);
    return null;
  }
};

const getOrganizationByUserId = async (userId: string) => {
  try {
    //get user_person by userId
    const userPerson = await prisma.userPerson.findFirst({
      where: {
        userId,
      },
    });
    if (!userPerson) return null;

    //get organization by personid
    const organizationPerson = await prisma.organizationPerson.findFirst({
      where: {
        personId: userPerson.personId,
      },
      include: {
        organization: true,
      },
    });
    if (!organizationPerson) return null;

    return organizationPerson.organization;
  } catch (error) {
    console.error("Error fetching user organization:", error);
    return null;
  }
};

const getPersonByUserId = async (userId: string) => {
  try {
    const userPerson = await prisma.userPerson.findFirst({
      where: {
        userId,
      },
      include: {
        person: true,
      },
    });

    return userPerson?.person;
  } catch (error) {
    console.error("Error fetching user person", error);
  }
};

export {
  getUserById,
  getAccountByUserId,
  getOrganizationByUserId,
  getPersonByUserId,
};
