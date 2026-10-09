import { Button } from '@/components/ui/button'
import React from 'react'

function CommunityHelpSection() {
  return (
    <div className='font-game p-4 border-4 rounded-2xl mt-7 flex items-center flex-col'>
      <h2 className='text-3xl'>Need Help?</h2>
      <p className='text-2xl'>Ask Question in our Community?</p>
      <Button className='text-2xl mt-3' variant={'pixel'} size={'lg'}>Go To Community</Button>
    </div>
  )
}

export default CommunityHelpSection
