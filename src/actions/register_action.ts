"use server";

import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import bcrypt from "bcryptjs";

import { LoginSchema, RegisterSchema } from "@/schemas";
import { AuthError } from "next-auth";

const register = async (data: z.infer<typeof RegisterSchema>) => {
  try {
    const validatedData = RegisterSchema.parse(data);

    if (!validatedData) {
      return {
        error: "Invalid data",
      };
    }
    const { email, name, password, confirmPassword } = validatedData;

    if (password !== confirmPassword) {
      return {
        error: "Passwords do not match",
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return {
        error: "User already exists",
      };
    }

    const lowerCaseEmail = email.toLowerCase();

    await prisma.user.create({
      data: {
        email: lowerCaseEmail,
        name,
        password: hashedPassword,
      },
    });
    return { success: "User created successfully" };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      error: "An error occurred while creating the user",
    };
  }
};

const login = async (data: z.infer<typeof LoginSchema>) => {
  const validatedData = LoginSchema.parse(data);
  if (!validatedData) {
    return { error: "Invalid input data" };
  }

  const { email, password } = validatedData;

  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!userExists || !userExists.password || !userExists.email) {
    // prevent login with provider because user have no password if login from provders
    return { error: "Email not found" };
  }

  try {
    await signIn("credentials", {
      email: userExists.email,
      password: password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Please confirm your email address" };
      }
    }
    throw error;
  }

  return { success: "User Logged in successfully!" };
};

// const googleLogin = async () => {
//   try {
//     await signIn("google", {
//       // if exists party user
//       redirectTo: "/dashboard",
//     });
//   } catch (error) {
//     if (error instanceof AuthError) {
//       return "google login failed";
//     }
//     throw error;
//   }
// };

const googleLoginForMember = async () => {
  try {
    await signIn("google", {
      redirectTo: "/manage",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "google login failed";
    }
    throw error;
  }
};

const logout = async () => {
  try {
    console.log("logout server action run");
    await signOut();
  } catch (error) {
    if (error instanceof AuthError) {
      return "log out failed";
    }
    throw error;
  }
};

export { register, login, logout, googleLoginForMember };
