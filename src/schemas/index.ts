import { Gender } from "@prisma/client";
import { PayType } from "@/types";
import * as z from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

const envSchema = z.object({
  AUTH_SECRET: z.string(),
});

//export const env_var = envSchema.parse(process.env);

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Please enter a valid password",
  }),
});

export const NewOrganizationSchema = z.object({
  name: z.string().min(3, {
    message: "Name is required",
  }),
  description: z.string().nullable(),
  logo: z.string().nullable(),
});

export const GenderEnum = z.nativeEnum(Gender); // z.enum(["MALE", "FEMALE"]);
export const PayTypeEnum = z.nativeEnum(PayType);

export const NewPersonSchema = z.object({
  fullName: z.string().min(1, {
    message: "Full name is required",
  }),
  nickName: z.string().nullable(),
  phone: z.string().min(7, {
    message: "Phone number is required",
  }),
  member: z.boolean(),
  gender: GenderEnum,
  fromDate: z.coerce.date().nullable().optional(),
  thruDate: z.coerce.date().nullable().optional(),
});

export const NewCurrencySchema = z.object({
  name: z.string().min(1, {
    message: "Currency name is required",
  }),
  symbol: z.string().max(5, {
    message: "allow 5 characters",
  }),
  code: z.string().max(10, {
    message: "allow only 10 characters",
  }),
  default: z.boolean(),
});

export const NewProjectSchema = z.object({
  description: z.string().min(1, {
    message: "description is required",
  }),
  location: z.string().min(1, {
    message: "location is required",
  }),
  fromDate: z.coerce.date(),
  thruDate: z.coerce.date(),
  openingAmount: z.number(),
});

export const NewIncomeSchema = z.object({
  memberId: z.string(),
  amount: z.number(),
  payType: PayTypeEnum,
  currencyId: z.number(),
  transactionDate: z.coerce.date(),
  remark: z.string().nullable(),
  imgUrl: z.string().nullable(),
  projectId: z.string(),
});

export const NewExpenseSchema = z.object({
  description: z.string(),
  amount: z.number(),
  projectId: z.string(),
  transactionDate: z.coerce.date(),
  imgUrl: z.string().nullable(),
  currencyId: z.number(),
});

export const NewTransferSchema = z.object({
  fromProjectId: z.string(),
  toProjectId: z.string(),
  amount: z.number(),
  currencyId: z.number(),
  transactionDate: z.coerce.date(),
});
