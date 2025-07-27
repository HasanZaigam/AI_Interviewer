"use client"

import Link from "next/link"
import Image from "next/image"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, 
  FormControl, 
  FormDescription,
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

type FormType = "sign-in" | "sign-up"

const authFormSchema = (type: FormType) => {
  return z.object({
    username: type === 'sign-up' ? z.string().min(2).max(50) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: type === "sign-up" ? z.string().min(6) : z.undefined(),
  }).refine((data) => {
    if (type === "sign-up" && data.password !== data.confirmPassword) {
      return false;
    }
    return true;
  }, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
}

const AuthForm = ({type} : {type : FormType }) => {

    const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>){
    console.log(data)
  }

  const isSignIn = type === "signin";

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
            <h2 className=" text-primary-100">AI Interviewer</h2>
          </div>
          <h3> Your Ai Interviewer is here</h3>
      
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} 
              className="w-full space-y-6 mt-4 form">
                {!isSignIn && (
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!isSignIn && (
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              <button className ="btn" type="submit" >{isSignIn ? 'Sign in' : 'Create an Account'}</button>
            </form>
          </Form>
          <p className="text-center text-sm text-muted-foreground">
            {isSignIn ? "Don't have an account ?" : "Already have an account ?"} 
            <Link href ={`/${isSignIn ? 'sign_up' : 'sign_in'}`}className="text-primary-100 underline">
              {isSignIn ? " Sign Up" : " Sign In"}
            </Link>
          </p>
          
      </div>
    </div>
  )
};

export default AuthForm;