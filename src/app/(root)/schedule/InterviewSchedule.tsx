import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import { Loader2Icon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import MeetingCard from "@/components/MeetingCard";

const InterviewSchedule = () => {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const interviews = useQuery(api.interviews.getAllInterviews);
  const users = useQuery(api.users.getUsers);
  const createInterview = useMutation(api.interviews.createInterview);

  const candidates = users?.filter((user) => user.role === "candidate") || [];
  const interviewers =
    users?.filter((user) => user.role === "interviewer") || [];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "9:00",
    candidateId: "",
    interviewerIds: user?.id ? [user.id] : [],
  });

  const scheduleMeeting = async () => {
    if (!client || !user) return;
    if (!formData.candidateId || formData.interviewerIds.length === 0) {
      toast.error("Please select a candidate and interviewer");
      return;
    }

    setIsCreating(true);
    try {
      const { title, description, date, time, candidateId, interviewerIds } =
        formData;
      const [hour, minute] = time.split(":");
      const meetingDate = new Date(date);
      meetingDate.setHours(parseInt(hour), parseInt(minute), 0);

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      });

      await createInterview({
        title,
        description,
        startTime: meetingDate.getTime(),
        status: "upcoming",
        streamCallId: id,
        candidateId,
        interviewerIds,
      });

      setOpen(false);
      toast.success("Meeting scheduled successfully");
      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: "9:00",
        candidateId: "",
        interviewerIds: user?.id ? [user.id] : [],
      });
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast.error("Failed to schedule meeting");
    } finally {
      setIsCreating(false);
    }
  };

  const addInterviewer = (interviewerId: string) => {
    if (!formData.interviewerIds.includes(interviewerId)) {
      setFormData((prev) => ({
        ...prev,
        interviewerIds: [...prev.interviewerIds, interviewerId],
      }));
    }
  };

  const removeInterviewer = (interviewerId: string) => {
    setFormData((prev) => ({
      ...prev,
      interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
    }));
  };

  const selectedInterviewers = interviewers?.filter((interviewer) =>
    formData.interviewerIds.includes(interviewer.clerkId)
  );

  const availableInterviewers = interviewers?.filter(
    (interviewer) => !formData.interviewerIds.includes(interviewer.clerkId)
  );
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Interviews</h1>
          <p className="text-muted-foreground">
            Schedule and manage interviews
          </p>
        </div>

        {/* Dialog Trigger */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size={"lg"}>Schedule Interview</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
            </DialogHeader>
            <ScrollArea>
              <div className="space-y-4 py-4">
                {/* Interview Form */}

                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Interview Title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Interview Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                {/* Candidate */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Candidate</label>
                  <Select
                    value={formData.candidateId}
                    onValueChange={(candidateId) =>
                      setFormData({ ...formData, candidateId })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Candidate" />
                    </SelectTrigger>
                    <SelectContent>
                      {candidates?.map((candidate) => (
                        <SelectItem
                          key={candidate.clerkId}
                          value={candidate.clerkId}
                        >
                          <UserInfo user={candidate} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Interviewers */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Interviewers</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedInterviewers?.map((interviewer) => (
                      <div
                        className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm-center"
                        key={interviewer.clerkId}
                      >
                        <UserInfo user={interviewer} />
                        {interviewer.clerkId !== user?.id && (
                          <Button
                            className="hover:text-destructive transition-colors"
                            onClick={() =>
                              removeInterviewer(interviewer.clerkId)
                            }
                          >
                            <XIcon className="size-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {availableInterviewers?.length > 0 && (
                      <Select onValueChange={addInterviewer}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Interviewer" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableInterviewers?.map((interviewer) => (
                            <SelectItem
                              key={interviewer.clerkId}
                              value={interviewer.clerkId}
                            >
                              <UserInfo user={interviewer} />
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex gap-4">
                  {/* Calendar */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Calendar
                      mode={"single"}
                      selected={formData.date}
                      onSelect={(date) =>
                        date && setFormData({ ...formData, date })
                      }
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>

                  {/* Time */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <Select
                      value={formData.time}
                      onValueChange={(time) =>
                        setFormData({ ...formData, time })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Time" />
                      </SelectTrigger>

                      <SelectContent>
                        {TIME_SLOTS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"} onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={scheduleMeeting} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    <span className="text-muted-foreground">
                      Scheduling ...
                    </span>
                  </>
                ) : (
                  "Schedule Interview"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading state & meeting card */}
      {!interviews ? (
        <div className="flex justify-center py-12">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : interviews.length > 0 ? (
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <MeetingCard key={interview._id} interview={interview} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No interviews scheduled
        </div>
      )}
    </div>
  );
};

export default InterviewSchedule;
