import { NewPersonSchema } from "@/schemas";
import { NextRequest } from "next/server";
import { z } from "zod";
type newMember = z.infer<typeof NewPersonSchema>;

// const saveMember = async (data: newMember) => {
//   try {
//     console.log(data);
//   } catch (error) {
//     console.error("error occuring in save member", error);
//   }
// };

// export { saveMember };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = NewPersonSchema.parse(body) as newMember;
    console.log("data", data);
    // Here you would typically save the data to a database
    // For example:
    // await saveMember(data);

    return new Response(
      JSON.stringify({ message: "Member saved successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error saving member:", error);
    return new Response(JSON.stringify({ error: "Failed to save member" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
