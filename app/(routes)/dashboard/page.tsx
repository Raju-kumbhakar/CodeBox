import React from 'react'
import WelcomeBanner from './_component/WelcomeBanner'
import EnrolledCourses from './_component/EnrolledCourses'
import ExploreMore from './_component/ExploreMore'
import InviteFriend from './_component/InviteFriend'
import UserStatus from './_component/UserStatus'
import UpgradeToPro from './_component/UpgradeToPro'


function page() {
  return (
    <div className='p-10 md:px-20 lg:px-36 xl:px-48'>
      <div className='grid grid-cols-3 gap-7'>
        <div className='col-span-2'>
          <WelcomeBanner/>
          <EnrolledCourses/>
          <ExploreMore/>
          <InviteFriend/>
        </div>
        <div>
           <UserStatus/>
           <UpgradeToPro/>
        </div>

      </div>
    </div>
  )
}

export default page
