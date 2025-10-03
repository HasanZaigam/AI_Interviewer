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
//     const lastMessage = message[message.length - 1];
    
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

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface AgentProps {
  userName: string;
}

const Agents = ({ userName }: AgentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  // speaking when active (you can replace with real VAD later)
  const isSpeaking = callStatus === CallStatus.ACTIVE;

  const message = [
    "what yours name?",
    "My name is John Doe, nice to meet you!",
  ];
  const lastMessage = message[message.length - 1];

  // Handlers to change call state
  const startCall = () => {
    // Simulate connecting -> active
    setCallStatus(CallStatus.CONNECTING);
    // simulate small delay for connecting (replace with real connection logic)
    setTimeout(() => {
      setCallStatus(CallStatus.ACTIVE);
    }, 800);
  };

  const endCall = () => {
    // End the call
    setCallStatus(CallStatus.FINISHED);
    // optionally reset after a short delay
    setTimeout(() => setCallStatus(CallStatus.INACTIVE), 700);
  };

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

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="avatar"
              width={120}
              height={120}
              className="object-cover"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {message.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            onClick={startCall}
            className="relative btn-call"
            aria-label="Start Call"
          >
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== CallStatus.CONNECTING && "hidden"
              )}
            >
              {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? "Call" : ". . ."}
            </span>

            {/* Visible text on button */}
            <span className="relative z-10">
              {callStatus === CallStatus.CONNECTING ? "Connecting..." : "Start Call"}
            </span>
          </button>
        ) : (
          <button onClick={endCall} className="btn-disconnect" aria-label="End Call">
            End Call
          </button>
        )}
      </div>
    </>
  );
};

export default Agents;
