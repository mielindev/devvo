"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import LoaderUI from "@/components/LoaderUI";
import { getCandidateInfo, groupInterview, Interview } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { INTERVIEW_CATEGORY } from "@/constants";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";
import CommentDialog from "@/components/CommentDialog";

const DashboardPage = () => {
  const users = useQuery(api.users.getUsers);
  const interviews = useQuery(api.interviews.getAllInterviews);
  const updateStatus = useMutation(api.interviews.updateInterviews);

  const handleUpdateStatus = async (
    interviewId: Id<"interviews">,
    status: string
  ) => {
    try {
      await updateStatus({
        id: interviewId,
        status,
      });
      toast.success(`Interview marked as ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  if (!users || !interviews) return <LoaderUI />;

  const groupInterviews = groupInterview(interviews);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8">
        <Link href={"/schedule"}>
          <Button className="mb-4">Schedule New Interview</Button>
        </Link>
      </div>

      <div className="space-y-8">
        {INTERVIEW_CATEGORY.map(
          (category) =>
            groupInterviews[category.id]?.length > 0 && (
              <section key={category.id}>
                {/* Category Title */}
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                  <Badge
                    variant={
                      category.variant as
                        | "default"
                        | "outline"
                        | "secondary"
                        | "destructive"
                    }
                  >
                    {groupInterviews[category.id].length}
                  </Badge>
                </div>

                {/* Content Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupInterviews[category.id].map((interview: Interview) => {
                    const candidateInfo = getCandidateInfo(
                      users,
                      interview.candidateId
                    );

                    const startTime = new Date(interview.startTime);

                    return (
                      <Card
                        key={interview._id}
                        className="hover:shadow-md transition-all"
                      >
                        {/* Candìdate Info */}
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-10">
                              <AvatarImage
                                src={candidateInfo.image}
                                alt={candidateInfo.name}
                              />
                              <AvatarFallback>
                                {candidateInfo.initials}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <CardTitle className="text-base">
                            {candidateInfo.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {interview.title}
                          </p>
                        </CardHeader>

                        {/* Date & Time */}
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="size-4" />
                              {format(startTime, "MMM d")}
                            </div>
                            <div className="flex items-center gap-1">
                              <ClockIcon className="size-4" />
                              {format(startTime, "h:mm a")}
                            </div>
                          </div>
                        </CardContent>

                        {/* Pass and Fail Buttons */}
                        <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                          {interview.status === "completed" && (
                            <div className="flex gap-2 w-full">
                              <Button
                                className="flex-1"
                                onClick={() =>
                                  handleUpdateStatus(interview._id, "succeeded")
                                }
                              >
                                <CheckCircle2Icon className="size-4 mr-2" />
                                Pass
                              </Button>
                              <Button
                                variant={"destructive"}
                                className="flex-1"
                                onClick={() =>
                                  handleUpdateStatus(interview._id, "failed")
                                }
                              >
                                <XCircleIcon className="size-4 mr-2" />
                                Fail
                              </Button>
                            </div>
                          )}

                          <CommentDialog interviewId={interview._id} />
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
