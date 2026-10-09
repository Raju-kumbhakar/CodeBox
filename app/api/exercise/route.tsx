import { db } from "@/config/db";
import {
  CompletedExerciseTable,
  CourseChaptersTable,
  CourseTable,
  ExerciseTable,
} from "@/config/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { courseId, chapterId, exerciseId } = await req.json();

    const courseInfo=await db.select().from(CourseTable)
    .where(eq(CourseTable.courseId,courseId));

    // Get chapter
    const chapter = await db
      .select()
      .from(CourseChaptersTable)
      .where(
        and(
          eq(CourseChaptersTable.courseId, Number(courseId)),
          eq(CourseChaptersTable.chapterId, Number(chapterId))
        )
      );

    // Get selected exercise
    const exercise = await db
      .select()
      .from(ExerciseTable)
      .where(
        and(
          eq(ExerciseTable.courseId, Number(courseId)),
          eq(ExerciseTable.chapterId, Number(chapterId)),
          eq(ExerciseTable.exerciseId, exerciseId)
        )
      );

      const completedExercise=await db.select().from(CompletedExerciseTable)
      .where(and(eq(CompletedExerciseTable?.courseId,courseId),eq(CompletedExerciseTable?.chapterId,chapterId)))

    return NextResponse.json({
      ...chapter[0],
      completedExercise:completedExercise,
      editorType:courseInfo[0]?.editorType,
      exerciseData: exercise[0]
        ? {
            chapterId: exercise[0].chapterId,
            courseId: exercise[0].courseId,
            exerciseId: exercise[0].exerciseId,
            exerciseName: exercise[0].exerciseName,
            exercisesContent: exercise[0].exerciseContent,
          }
        : null,
    });
  } catch (error) {
    console.error("Exercise API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch exercise",
      },
      {
        status: 500,
      }
    );
  }
}