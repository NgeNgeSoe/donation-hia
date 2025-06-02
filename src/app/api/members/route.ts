import { NewPersonSchema } from "@/schemas";
import { z } from "zod";
type newMember = z.infer<typeof NewPersonSchema>;

const saveMember = async (data: newMember) => {
  try {
    console.log(data);
  } catch (error) {
    console.error("error occuring in save member", error);
  }
};

export { saveMember };
