"use client";

import LoaderUI from "@/components/LoaderUI";
import useUserRole from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import InterviewSchedule from "./InterviewSchedule";

const SchedulePage = () => {
  const router = useRouter();
  const { isInterviewer, isCandidate, isLoading } = useUserRole();

  if (isLoading) return <LoaderUI />;

  if (!isInterviewer) return router.push("/");

  return <InterviewSchedule />;
};

export default SchedulePage;
