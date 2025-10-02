import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import InterviewCard from "../components/InterviewCard";
import { dummyInterviews } from "@/constants";

export default function Home() {
  return (  
    <>
      <section className="card-cta mt-20">
          <div className="flex flex-col gap-6 max-w-lg">
            <h1 className="text-4xl font-bold text-white mb-4">Get Interview Ready with AI Practice & Feedback</h1>
            <p className="text-light-100">
              Practice on real interview question and get instant feedback.
            </p>
            <div className="">
              <Button asChild className="btn-primary max-sm:w-full">
                <Link href="/interview">Start an Interview</Link>
              </Button>
            </div>
          </div>
          <Image src="/robot.png" alt="hero-image" width={500} height={500} className="max-sm:hidden" />
      </section>

      <section className="flex flex-col gap-6 mt-8 ml-2">
        <h2> Your interviews</h2>
        <div className="interviews-section">
            {dummyInterviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))}

        </div>
      </section>

      <section>
          <div className="flex flex-col gap-6 mt-8">
            <h2> Take an Interview</h2>
            <div className="interviews-section">
            {dummyInterviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))}
            </div>
          </div>
      </section>
   
   
   </>
  ); 
}