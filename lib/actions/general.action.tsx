"use server"

type GetFeedbackParams = {
  interviewId: string;
  userId: string;
};

export async function getFeedbackByInterviewId(params: GetFeedbackParams) {
  // TODO: Implement actual feedback fetching logic
  // For now, return null to allow the component to work
  return null;
} 