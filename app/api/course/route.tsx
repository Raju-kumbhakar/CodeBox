import { db } from "@/config/db";
import {
  CompletedExerciseTable,
  CourseChaptersTable,
  CourseTable,
  EnrolledCourseTable,
} from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, asc, desc, eq, inArray} from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseid");
  const user = await currentUser();

  const userEmail=user?.primaryEmailAddress?.emailAddress;

  if (!userEmail){
    return NextResponse.json({error:"User Not Authenticated"})
  } 
    if(courseId && courseId!=='enrolled'){

    const result = await db
      .select()
      .from(CourseTable)
      //@ts-ignore
      .where(eq(CourseTable.courseId, Number(courseId)));

    const chapterResult = await db
      .select()
      .from(CourseChaptersTable)
      //@ts-ignore
      .where(eq(CourseChaptersTable.courseId, Number(courseId)))
      .orderBy(asc(CourseChaptersTable.chapterId));

    const enrolledCourse = await db
      .select()
      .from(EnrolledCourseTable)
      .where(
        and(
          //@ts-ignore
          eq(EnrolledCourseTable.courseId, courseId),
          //@ts-ignore
          eq(
            EnrolledCourseTable.userId,
            user?.primaryEmailAddress?.emailAddress
          )
        )
      );

    const isEnrolledCourse = enrolledCourse.length > 0;

    const completedExercises = await db
      .select()
      .from(CompletedExerciseTable)
      .where(
        and(
          //@ts-ignore
          eq(CompletedExerciseTable.courseId, courseId),
          eq(
            CompletedExerciseTable.userId,
            user?.primaryEmailAddress?.emailAddress
          )
        )
      )
      .orderBy(
        desc(CompletedExerciseTable.courseId),
        desc(CompletedExerciseTable.exerciseId)
      );

    return NextResponse.json({
      ...result[0],
      chapters: chapterResult,
      userEnrolled: isEnrolledCourse,
      courseEnrolledInfo: enrolledCourse[0],
      completedExercises,
    });
  } 
  else if(courseId=='enrolled'){
// Fetch all enrolled courses for the user
const enrolledCourses = await db
    .select()
    .from(EnrolledCourseTable)
    .where(eq(EnrolledCourseTable.userId, userEmail));

if (enrolledCourses.length === 0) {
    return NextResponse.json([]);
}

// Extract courseIds
const courseIds = enrolledCourses.map(c => c.courseId);

//Fetch all course details in one go
const courses = await db
    .select()
    .from(CourseTable)
    //@ts-ignore
    .where(inArray(CourseTable.courseId, courseIds));

//  Fetch chapters for all courses
const chapters = await db
    .select()
    .from(CourseChaptersTable)
    //@ts-ignore
    .where(inArray(CourseChaptersTable.courseId, courseIds))
    .orderBy(asc(CourseChaptersTable.chapterId));

//Fetch completed exercises for all courses
const completed = await db
    .select()
    .from(CompletedExerciseTable)
    //@ts-ignore
    .where(and(inArray(CompletedExerciseTable.courseId, courseIds), eq(CompletedExerciseTable.userId, userEmail)))
    .orderBy(
        desc(CompletedExerciseTable.courseId),
        desc(CompletedExerciseTable.exerciseId)
    );

const finalResult = courses.map(course => {
    const courseEnrollInfo = enrolledCourses.find(e => e.courseId === course.courseId);

    return {
        ...course,
        chapters: chapters.filter(ch => ch.courseId === course.courseId),
        completedExercises: completed.filter(cx => cx.courseId === course.courseId),
        courseEnrolledInfo: courseEnrollInfo,
        userEnrolled: true
    };
});

const formattedResult = finalResult.map(item => {
    // Count total exercises by summing exercises arrays in all chapters
    const totalExercises = item.chapters.reduce((acc, chapter) => {
        // If exercises is stored as JSON/array
        const exercisesCount = Array.isArray(chapter.exercises) ? chapter.exercises.length : 0;
        return acc + exercisesCount;
    }, 0);

    const completedExercises = item.completedExercises.length;

    return {
        courseId: item.courseId,
        title: item.title,
        bannerImage:item?.bannerImage,
        totalExercises,
        completedExercises,
        xpEarned: item.courseEnrolledInfo?.xpEarned || 0,
        level: item.level
    };
});

return NextResponse.json(formattedResult);
  }
  else {
    const result = await db
      .select()
      .from(CourseTable)
      .orderBy(asc(CourseTable.id));

    return NextResponse.json(result);
  }
}