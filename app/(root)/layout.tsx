import { ReactNode } from 'react'
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const RootLayout = async ({children} : {children : ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  if(!isUserAuthenticated) {
    redirect('/sign-in');
  }
  return (
    <div className="root-layout">
      {children}
    </div>
  )
}

export default RootLayout;