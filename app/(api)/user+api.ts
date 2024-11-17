import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { name, email, clerkId } = await request.json();

    // Ensure all required fields are present
    if (!name || !email || !clerkId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // SQL query to insert or update user
    const response = await sql`
      INSERT INTO users (
        name, 
        email, 
        clerk_id
      ) 
      VALUES (
        ${name}, 
        ${email},
        ${clerkId}
      )
      ON CONFLICT (clerk_id) 
      DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email
      RETURNING *;
      
    `;

    console.log("Database response:", response);

    // Return the response
    return new Response(
      JSON.stringify({ data: response }),
      { status: 200 } // A successful update should return a 200 status code
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
