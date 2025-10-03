import React from 'react';
import dayjs from 'dayjs';
import { getRandomInterviewCover } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DisplayTechIcon from './DisplayTechIcon';

interface InterviewCardProps {
  interviewId: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string | Date;
}

interface Feedback {
  createdAt?: string | Date;
  totalScore?: number;
  finalAssessment?: string;
}

const InterviewCard = ({interviewId, userId, role, type, techstack, createdAt}: InterviewCardProps) => {
  const feedback = null as Feedback | null;
  const normalizedType = /mix/gi.test(type) ? "mixed" : type;
  const formattedDate = dayjs(createdAt || Date.now()).format("DD MMM YYYY");
  
  return (
    <div className="card-border w-full min-h-96p">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
            <p className="text-dark-100 text-sm font-medium">{normalizedType}</p>
           
          </div>
            <Image src={getRandomInterviewCover()} alt="coverImage" width={90} height={90} 
                className="rounded-full object-fit" />

            <h3 className='mt-5 capitalize'>
                {role} Interview
            </h3>

            <div className="flex flex-row mt-3 gap-5">

                <div className="flex flex-row gap-2">
                    <Image src="/calendar.svg" alt="calender" width={22} height={22} />
                    <p>{formattedDate}</p>
                </div>
                <div className="flex flex-row gap-2">
                    <Image src="/star.svg" alt="clock" width={22} height={22} />
                    <p>{feedback?.totalScore || '---'}/100</p>
                </div>
            </div>

            <p className='lime-clamp-2 mt-5'>
                {feedback?.finalAssessment || "You haven&apos;t taken this interview yet.Take it now to improve your skills"}
            </p>     
        </div>
        <div className="flex flex-row justify-between">
            <DisplayTechIcon techStack={techstack} />
            <Button className='btn-primary'>
                <Link href={feedback 
                     ? `/interview/${interviewId}` 
                     : `/interview/${interviewId}/feedback`
                }>
                    {feedback ? "View Feedback" : "Take Interview"}
                </Link>
            </Button>

        </div>
      </div>
    </div>
  );
};

export default InterviewCard;