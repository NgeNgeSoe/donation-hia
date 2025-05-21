import { env_var, NewPersonSchema } from "@/schemas";
import { z } from "zod";
type newMember = z.infer<typeof NewPersonSchema>;

const saveMember = async (data: newMember) => {
  try {
  } catch (error) {
    console.error("error occuring in save member");
  }
};

export { saveMember };
