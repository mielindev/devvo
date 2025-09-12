import { getMeetingStatus, Interview } from "@/lib/utils";
import useMeetingActions from "./../hooks/useMeetingActions";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CalendarIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const MeetingCard = ({ interview }: { interview: Interview }) => {
  const { joinMeeting } = useMeetingActions();

  const status = getMeetingStatus(interview);
  const formattedDate = format(
    new Date(interview.startTime),
    "EEEE, MMMM d,h:mm a"
  );
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="size-4" />
            <span>{formattedDate}</span>
          </div>
          <Badge
            variant={
              status === "ongoing"
                ? "default"
                : status === "upcoming"
                  ? "secondary"
                  : "outline"
            }
          >
            {status === "ongoing"
              ? "Live Now"
              : status === "upcoming"
                ? "Upcoming"
                : "Completed"}
          </Badge>
        </div>
        <CardTitle>{interview.title}</CardTitle>
        {interview.description && (
          <CardDescription className="line-clamp-2">
            {interview.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {status === "ongoing" && (
          <Button
            className="w-full"
            onClick={() => joinMeeting(interview.streamCallId)}
          >
            Join Meeting
          </Button>
        )}

        {status === "upcoming" && (
          <Button variant={"outline"} className="w-full" disabled>
            Waiting for start
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MeetingCard;
