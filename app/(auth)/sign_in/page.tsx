import GoogleAuthButton from '../../components/GoogleAuthButton'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image 
            src="/logo.svg" 
            alt="Logo" 
            height={32} 
            width={36}
          />
          <h2 className="text-primary-100">AI Interviewer</h2>
        </div>
        <h3 className="text-center">Your AI Interviewer is here</h3>
        
        <div className="space-y-4">
          <GoogleAuthButton />
          
          <div className="text-center text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  )
}

export default page