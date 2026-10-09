"use client"
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import SplitterLayout from 'react-splitter-layout'
import 'react-splitter-layout/lib/index.css';
import { CompletedExercises,exercise } from '../../../_components/CourseList';
import ContentSection from './_components/ContentSection';
import CodeEditor from './_components/CodeEditor';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export type CourseExercise={
   chapterId:number,
   courseId:number,
   desc:string,
   name:string,
   editorType:string,
   exercises:exercise[],
   exerciseData:ExerciseData,
   completedExercise:CompletedExercises[]
}

type ExerciseData={
  chapterId:number,
  courseId:number,
  exerciseId:string,
  exerciseName:string,
  exercisesContent:ExercisesContent
}

type ExercisesContent={
  content:string,
  hint:string,
  hinXp:string,
  starterCode:any,
  task:string
}

function Playground() {

 const {courseId, chapterId, exerciseslug}=useParams();
const [loading,setLoading]=useState(false);

const [courseExerciseData,setCourseExerciseData]=useState<CourseExercise>();
const [exerciseInfo,setExerciseInfo]=useState<exercise>();
const [NextButtonRoute,setNextButtonRoute]=useState<string>();
const [PrevButtonRoute,setPrevButtonRoute]=useState<string>();

useEffect(() => {
  if (courseId && chapterId && exerciseslug) {
    GetExerciseCourseDetail()
  }
}, [courseId, chapterId, exerciseslug])

 const GetExerciseCourseDetail=async()=>{
  setLoading(true)
  const result = await axios.post('/api/exercise',{
    courseId:courseId,
    chapterId:chapterId,
    exerciseId:exerciseslug
  })
  setCourseExerciseData(result.data);
  setLoading(false);
 }

 useEffect(()=>{
  document.body.style.overflow='hidden';
  return ()=>{
    document.body.style.overflow='';
  }
 },[])

 useEffect(() => {
  if (courseExerciseData) {
    GetExerciseDetail()
    GetPrevNextButtonRoute()
  }
}, [courseExerciseData, exerciseslug])

 const GetExerciseDetail=()=>{
  const exerciseInfo=courseExerciseData?.exercises?.find((item)=>item.slug==exerciseslug);
  setExerciseInfo(exerciseInfo);
 }

 const GetPrevNextButtonRoute=()=>{
  //Current Index of Exercise
  const currentExerciseIndex=courseExerciseData?.exercises?.findIndex(item=>item.slug==exerciseslug)??0;
 
  const NextExercise=courseExerciseData?.exercises[currentExerciseIndex+1]?.slug;
  const PrevExercise = courseExerciseData?.exercises[currentExerciseIndex-1]?.slug;

  setNextButtonRoute(NextExercise?'/courses/'+courseId+"/"+chapterId+"/"+NextExercise:undefined);
  setPrevButtonRoute(PrevExercise?'/courses/'+courseId+"/"+chapterId+"/"+PrevExercise:undefined);
 }

  return (
    <div className='border-t-4'>
      <SplitterLayout percentage
      primaryMinSize={20}
      secondaryInitialSize={60}>
        <div>
          <ContentSection courseExerciseData={courseExerciseData}
          loading={loading}/>
        </div>
        <div>
          <CodeEditor courseExerciseData={courseExerciseData}
          loading={loading}/>
        </div>
      </SplitterLayout>
      <div className='font-game fixed bottom-0 w-full bg-zinc-900 flex p-4 justify-between items-center'>
    <Link href={PrevButtonRoute ??'/courses/'+courseId}>
    <Button variant={'pixel'} className="text-xl">Previous</Button>
    </Link>
    <div className='flex gap-2 items-center'>
      <Image src='/star.png' alt='star' width={40} height={40}/>
      <h2 className='text-2xl'>You Can Earn <span className='text-4xl'>{exerciseInfo?.xp}</span> XP</h2>
    </div>
    <Link href={NextButtonRoute ??'/courses/'+courseId}>
    <Button variant={'pixel'} className="text-xl">Next</Button>
    </Link>
   </div>
    </div>
  )
}

export default Playground
