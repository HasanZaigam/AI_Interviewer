"use client"

import Link from "next/link"
import Image from "next/image"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { auth } from "@/firebase/client"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { setSessionCookie } from "@/lib/actions/auth.action"
import { signUp, signIn } from "@/lib/actions/auth.action"


type FormType = "sign-in" | "sign-up"

const authFormSchema = (type: FormType) => {
  return z.object({
    username: type === 'sign-up' ? z.string().min(2).max(50) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: type === "sign-up" ? z.string().min(6) : z.string().optional(),
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
    const router = useRouter();
    const formSchema = authFormSchema(type);
    const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

 async function onSubmit(data: z.infer<typeof formSchema>){
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Form submitted with data:", data);
    console.log("Form type:", type);
    console.log("Form errors:", form.formState.errors);
    
    setIsLoading(true);
    
    try {
      if(type === "sign-up"){
        const {username, email, password} = data;
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const result = await signUp({
          name: username ?? "",
          email,
          uid: userCredentials.user.uid,
        })

        if(!result?.success) {
          toast.error(result?.message || "Failed to create account");
          return;
        }
        toast.success("Account created successfully! Please sign in.");
        router.push("/sign_in");
      }else{
        const {email, password} = data;
        console.log("Attempting to sign in with email:", email);
        
        try {
          const userCredentials = await signInWithEmailAndPassword(auth, email, password);
          console.log("Firebase Auth sign-in successful, getting ID token...");
          
          const idToken = await userCredentials.user.getIdToken();
          console.log("ID token obtained, calling server-side signIn...");
          
          const result = await signIn({
            email,
            idToken,
          });

          console.log("Server-side signIn result:", result);

          if(!result?.success) {
            console.log("Sign-in failed:", result?.message);
            toast.error(result?.message || "Failed to sign in");
            return;
          }
          
          console.log("Sign-in successful, redirecting to homepage...");
          toast.success("Signed in successfully");
          
          // Force redirect to homepage
          window.location.href = "/";
        } catch (firebaseError: any) {
          console.error("Firebase Auth error:", firebaseError);
          throw firebaseError; // Re-throw to be caught by the outer catch block
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        toast.error("An account with this email already exists. Please sign in instead.");
        router.push("/sign_in");
        return;
      } else if (error.code === 'auth/user-not-found') {
        toast.error("No account found with this email. Please create an account first.");
        router.push("/sign_up");
        return;
      } else if (error.code === 'auth/wrong-password') {
        toast.error("Incorrect password. Please try again.");
        return;
      } else if (error.code === 'auth/weak-password') {
        toast.error("Password is too weak. Please use a stronger password.");
        return;
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Please enter a valid email address.");
        return;
      } else if (error.code === 'auth/too-many-requests') {
        toast.error("Too many failed attempts. Please try again later.");
        return;
      } else if (error.code === 'auth/network-request-failed') {
        toast.error("Network error. Please check your connection and try again.");
        return;
      }
      
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  }

  const isSignIn = type === "sign-in";

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
              <button 
                className ="btn" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : (isSignIn ? 'Sign in' : 'Create an Account')}
              </button>
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