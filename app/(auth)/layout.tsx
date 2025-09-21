import { ReactNode } from 'react'
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  
  if (isUserAuthenticated) {
    redirect('/');
  }
  
  return (
    <div className='auth-layout min-h-screen flex items-center justify-center bg-dark-100 pattern'>
      {children}
    </div>
  )
}

export default AuthLayout




