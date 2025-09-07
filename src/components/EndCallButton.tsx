import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import React from "react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const updateInterviewStatus = useMutation(api.interviews.updateInterviews);

  const interview = useQuery(api.interviews.getInterviewsByStreamCallId, {
    streamCallId: call?.id || "",
  });

  if (!call || !interview) return null;

  const isMeetingOwner = localParticipant?.userId === call.state.createdBy?.id;

  if (!isMeetingOwner) return null;

  const enCall = async () => {
    try {
      await call.endCall();
      await updateInterviewStatus({
        id: interview._id,
        status: "completed",
      });
      router.push("/");
      toast.success("Meeting ended for everyone");
    } catch (error) {
      console.error("Error ending meeting:", error);
      toast.error("Failed to end meeting");
    }
  };

  return (
    <Button variant={"destructive"} onClick={enCall}>
      End Meeting
    </Button>
  );
};

export default EndCallButton;
