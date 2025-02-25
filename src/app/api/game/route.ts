import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/drizzle";
import { todoTable } from "../../lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const games = await db.select().from(todoTable);
    console.log("Fetched games from DB:", games);
    return NextResponse.json(games);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: (error as { message: string }).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    if (!req.game) {
      throw new Error("Please enter a valid game name");
    }

  
    const insertedTasks = await db.insert(todoTable).values({ game: req.game }).returning();
    
    
    if (!insertedTasks || insertedTasks.length === 0) {
      throw new Error("Failed to insert task");
    }

    
    return NextResponse.json(insertedTasks[0]);  
  } catch (error) {
    return NextResponse.json(
      { message: (error as { message: string }).message },
      { status: 500 }
    );
  }
}


export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { message: "Task ID is required" },
        { status: 400 }
      );
    }
    await db.delete(todoTable).where(eq(todoTable.id, id));
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: (error as { message: string }).message },
      { status: 500 }
    );
  }
}
