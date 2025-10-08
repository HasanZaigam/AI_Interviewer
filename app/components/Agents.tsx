// "use client"

// import React, { useState } from 'react'
// import Image from 'next/image'
// import { cn } from '@/lib/utils'

// enum CallStatus {
//     INACTIVE = 'INACTIVE',
//     CONNECTING = 'CONNECTING',
//     ACTIVE = 'ACTIVE',
//     FINISHED = 'FINISHED'
// }

// interface AgentProps {
//     userName: string;
// }

// const Agents = ({userName}: AgentProps) => {
//     const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
//     const isSpeaking = true;
//     const message = [
//         'what yours name?',
//         'My name is John Doe, nice to meet you!'
//     ];
//     const lastestMessage = message[message.length - 1];
    
//     return (
//         <>
//             <div className="call-view">
//             <div className="card-interviewer">
//                 <div className="avatar">
//                 <Image src="/ai-avatar.png" alt="avatar" width={65} height={54} className="object-cover" />
//                 {isSpeaking && <span className="animate-speak"></span>}
//                 </div>
//                 <h3>AI Interviewer</h3>
//                 </div>
//                 <div className="card-border">
//                     <div className="card-content">
//                     <Image src="/user-avatar.png" alt="avatar" width={650} height={540} className="object-cover size-[120px]" />
//                     {/* {isSpeaking && <span className="animate-speak"></span>} */}
                
//                     <h3>{userName}</h3>
//                     </div>
//             </div>
//             </div>
//                 { message.length > 0 && (
//                     <div className="transcript-border">
//                         <div className="transcript">
//                             <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>
//                                 {lastMessage}
//                             </p>
//                         </div>
//                     </div>
//                 )}
//             <div className='w-full flex justify-center'>
//                 {callStatus !== CallStatus.ACTIVE ? (
//                     <button className='relative btn-call'>
//                         <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== CallStatus.CONNECTING && 'hidden')}>
//                             {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? 'Call' : '. . .'}
//                         </span>
//                     </button>
//                 ) : (
//                     <button className='btn-disconnect'>
//                         End Call
//                     </button>
//                 )}
//             </div>
//         </>
//     )
// }

// export default Agents;







"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface AgentProps {
  userName?: string;
  userId?: string;
  type?: string;
}

type VapiMessage = {
  type: string;
  transcriptType?: string;
  role: 'user' | 'system' | 'assistant';
  transcript?: string;
};

interface savedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

const Agents = ({ userName, userId, type }: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [message, setMessage] = useState<savedMessage[]>([]);
  

  useEffect(() =>{

    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: VapiMessage) =>{
      if(message.type === 'transcript' && message.transcriptType === 'final'){
        const newMessage = {role: message.role, content: message.transcript ?? ''}

        setMessage((prev) => [...prev, newMessage]);
      }
      
      // Detect user speaking based on transcript events
      if(message.type === 'transcript' && message.role === 'user'){
        if(message.transcriptType === 'partial' || message.transcriptType === 'final'){
          setIsUserSpeaking(true);
          // Reset user speaking state after a short delay
          setTimeout(() => setIsUserSpeaking(false), 1000);
        }
      }
    }

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.log('Error',error);

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    }
  }, []);

  useEffect(() =>{
    if(callStatus === CallStatus.FINISHED) router.push('/');

  },[message, callStatus, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? '', {
      variableValues: {
        username: userName ?? '',
        userid: userId ?? '',
      },
    });
  }
  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();

  }

  
  const lastestMessage = message[message.length - 1]?.content;
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;


  // // Handlers to change call state
  // const startCall = () => {
  //   // Simulate connecting -> active
  //   setCallStatus(CallStatus.CONNECTING);
  //   // simulate small delay for connecting (replace with real connection logic)
  //   setTimeout(() => {
  //     setCallStatus(CallStatus.ACTIVE);
  //   }, 800);
  // };

  // const endCall = () => {
  //   // End the call
  //   setCallStatus(CallStatus.FINISHED);
  //   // optionally reset after a short delay
  //   setTimeout(() => setCallStatus(CallStatus.INACTIVE), 700);
  // };

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="avatar"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className={cn("card-border", callStatus !== CallStatus.INACTIVE && "call-active-border")}> 
          <div className="card-content">
            <div className="user-avatar">
              <Image
                src="/user-avatar.png"
                alt="avatar"
                width={120}
                height={120}
                className="object-cover rounded-full"
              />
              {isUserSpeaking && <span className="animate-speak" />}
            </div>
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {message.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastestMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastestMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            onClick={handleCall}
            className="relative btn-call"
            aria-label="Start Call"
          >
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== CallStatus.CONNECTING && "hidden"
              )}
            >
              {isCallInactiveOrFinished ? "Call" : ". . ."}
            </span>

            {/* Visible text on button */}
            <span className="relative z-10">
              {callStatus === CallStatus.CONNECTING ? "Connecting..." : "Start Call"}
            </span>
          </button>
        ) : (
          <button onClick={handleDisconnect} className="btn-disconnect" aria-label="End Call">
            End Call
          </button>
        )}
      </div>
    </>
  );
};

export default Agents;
