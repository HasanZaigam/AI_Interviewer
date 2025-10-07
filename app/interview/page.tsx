import React from 'react'
import Agents from '@/app/components/Agents'
import { getCurrentUser } from '@/lib/actions/auth.action';

const Page = async () => {
    const user = await getCurrentUser();
    return (
      <>
        <div className="root-layout">
            <h3>Interview</h3>
            <Agents userName={user?.name ?? ''} userId={user?.id ?? ''} type="generate" />
         </div>
     </>
      
    )
}

export default Page;
