import React from 'react'
import { Sandpack, useSandpack } from "@codesandbox/sandpack-react";
import 'react-splitter-layout/lib/index.css';
import { nightOwl } from "@codesandbox/sandpack-themes";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import SplitterLayout from 'react-splitter-layout';
import { CourseExercise } from '../page' 
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

type Props={ 
  courseExerciseData:CourseExercise| undefined,
  loading:boolean 
} 

const CodeEditorChildren=({onCompleteExercise, IsCompleted}:any)=>{

    const {sandpack} =useSandpack();

    return(
        <div className='font-game absolute bottom-40 flex gap-5 right-5 '>
            <Button variant={'pixel'} size={'lg'} className="text-xl" 
            onClick={()=>sandpack.runSandpack()}>Run Code</Button>
            <Button variant={'pixel'} className="bg-[#a3e354] text-xl" size={'lg'}
            disabled={IsCompleted}
            onClick={()=>onCompleteExercise()}
            >
            {IsCompleted?'Already Completed':'Mark Completed!'} </Button>
        </div>
    )
}

function CodeEditor({courseExerciseData,loading}:Props) {

  const {exerciseslug}=useParams();
  const exerciseIndex=courseExerciseData?.exercises?.findIndex(item=>item.slug==exerciseslug)
  
  const IsCompleted=courseExerciseData?.completedExercise?.find(item=>item?.exerciseId==Number(exerciseIndex)+1);

  const onCompleteExercise=async()=>{
    
     if(exerciseIndex==undefined){
      return;
     }
    const result=await axios.post('/api/exercise/complete',{
      courseId:courseExerciseData?.courseId,
      chapterId:courseExerciseData?.chapterId,
      exerciseId:exerciseIndex+1,
      xpEarned:courseExerciseData?.exercises[exerciseIndex].xp
    })
      toast.success('Exercise Completed!')
  }

  return (
    <div className='h-full'>
    <SandpackProvider
    theme={nightOwl}
    //@ts-ignore
    template={courseExerciseData?.editorType??'react'}
    style={{
        height:'100vh'
    }}
    files={courseExerciseData?.exerciseData?.exercisesContent?.starterCode}
    options={{
        autorun:false,
        autoReload:false
    }}
    >
    <SandpackLayout  style={{
        height:'100%'
    }}>
    <SplitterLayout
     percentage
  primaryMinSize={30}
  secondaryMinSize={30}
  secondaryInitialSize={50}
    >
        <div className='relative h-full'>
            <SandpackCodeEditor 
            showTabs
            showRunButton={false}
             style={{
        height:'100%'
    }}/>
        <CodeEditorChildren onCompleteExercise={onCompleteExercise}
        IsCompleted={IsCompleted}/>
        </div>
      
      <SandpackPreview  
      showNavigator
      showOpenInCodeSandbox={false}
      showOpenNewtab
      style={{
        height:'100%'
    }} />
    </SplitterLayout>
    </SandpackLayout>
  </SandpackProvider>
    </div>
  )
}

export default CodeEditor
