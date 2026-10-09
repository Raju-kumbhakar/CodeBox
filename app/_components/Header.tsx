'use client';

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { UserButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useParams, usePathname } from 'next/navigation';
import axios from 'axios';
import { Course } from '../(routes)/courses/_components/CourseList';
import { title } from 'process';

// const courses = [
//   { id: 1, name: 'HTML', desc: 'Learn the fundamentals of HTML.', path: '/course/1/detail' },
//   { id: 2, name: 'CSS', desc: 'Master CSS to style layouts.', path: '/course/2/detail' },
//   { id: 3, name: 'React', desc: 'Build dynamic applications.', path: '/course/3/detail' },
//   { id: 4, name: 'Python', desc: 'Learn Python programming.', path: '/course/5/detail' },
// ];

const Header = () => {
  const { isLoaded, isSignedIn } = useUser();
  const path=usePathname();
  const {exerciseslug}=useParams();
  const [courses,setCourses]=useState<Course[]>();
   
  useEffect(()=>{
    GetCourses();
  },[])

  const GetCourses=async()=>{
    const result=await axios.get('/api/course');
    setCourses(result.data);
  }

  return (
    <div className='p-4 max-w-7xl font-game flex justify-between items-center w-full mx-auto'>
      <div className='flex gap-2 items-center'>
        <Image src='/logo.png' alt='logo' width={40} height={40} priority />
        <h2 className='font-bold text-3xl font-game'>CodeBox</h2>
      </div>
       {/* Navbar */}
      {!exerciseslug&& courses&&(
      <NavigationMenu>
        <NavigationMenuList className='gap-8'>
          <NavigationMenuItem>
            <NavigationMenuTrigger className='text-xl'>Courses</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className='grid grid-cols-2 gap-2 p-2 sm:w-[400px] md:w-[500px] lg:w-[600px]'>
                {courses.map((course,index) => (
                  <li key={course.id}>
                    <NavigationMenuLink
                      render={
                        <Link href={'/courses/'+course?.courseId}>
                          <div className=' p-4 hover:bg-accent rounded-xl cursor-pointer transition-all duration-500'>
                          <h2 className='font-medium text-2xl font-game'>{course?.title}</h2>
                          <p className='text-md font-game text-gray-500 line-clamp-2 '>{course?.desc}</p>
                          </div>
                        </Link>
                      }
                    />
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href='/projects'>Projects</Link>} />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href='/pricing'>Pricing</Link>} />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href='/contact-us'>Contact Us</Link>} />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>)}
      <h2 className='text-2xl'>{exerciseslug?.toString().replace("-",' ').toLocaleUpperCase()}</h2>
       
      
      {/* Auth Action Slot - Render a skeleton fallback until Clerk loads */}
      {!isLoaded ? (
        <div className="h-10 w-24 rounded-lg bg-slate-200 animate-pulse" />
      ) : !isSignedIn ? (
        <Link href="/sign-in">
          <Button className="font-game text-2xl" variant="pixel">
            SignUp
          </Button>
        </Link>
      ) : (
        <div className="flex gap-4 items-center">
          <Link href="/dashboard">
            <Button className="font-game text-2xl" variant="pixel">
              Dashboard
            </Button>
          </Link>
          <UserButton />
        </div>
      )}
    </div>
  )
}

export default Header;