import React from 'react'
import Agents from '@/app/components/Agents'

const Page = () => {
    return (
       <div className="root-layout">
            <h3 userName = "You" userId = "user1" type = "generate">Interview</h3>
           
            <Agents />
       </div>
    )
}

export default Page;
