'use client'

import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { UserDetailContext } from '@/context/UserDetailContext'
import Header from './_components/Header'

// Suppress false-positive React 19 warning for next-themes internal script injection
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
      return
    }
    orig.apply(console, args)
  }
}

function Provider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>){
  
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState();

  useEffect(()=>{
    if (user) {
      CreateNewUser()
    }
  }, [user])

  const CreateNewUser = async () => {
    const result = await axios.post('/api/user', {})
    console.log(result)
    setUserDetail(result?.data);
  }
  
  return (
    <NextThemesProvider {...props}>
      <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
        {/* Header / Navbar */}
        <div className='flex flex-col items-center'>
          <Header/>
        </div>
        {children}
      </UserDetailContext.Provider>
    </NextThemesProvider>
  )
}

export default Provider