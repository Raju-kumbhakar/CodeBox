import React from 'react'
import { Button } from '../components/ui/button'
import Header from './_components/Header'
import Hero from './_components/Hero'


const page = () => {
  return (
    <div className='flex flex-col items-center'>
      {/* Header / Navbar */}
      <Header/>

      {/* Hero Section */}
      <Hero/>

    </div>
  )
}

export default page
