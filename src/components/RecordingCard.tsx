import { CallRecording } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { calculateRecordingDuration } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { CalendarIcon, ClockIcon, CopyIcon, PlayIcon } from "lucide-react";
import { Button } from "./ui/button";

const RecordingCard = ({ recordings }: { recordings: CallRecording }) => {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(recordings.url);
      toast.success("Link copied to clipboard");
    } catch (error) {
      console.error("Error copying link:", error);
      toast.error("Failed to copy link to clipboard");
    }
  };

  const formatedStartTime = recordings.start_time
    ? format(new Date(recordings.start_time), "MMM d, yyyy, h:mm a")
    : "Unknown";

  const duration =
    recordings.start_time && recordings.end_time
      ? calculateRecordingDuration(recordings.start_time, recordings.end_time)
      : "Unknown Duration";
  return (
    <Card className="group hover:shadow-md transition-all duration-300">
      <CardHeader className="space-y-1">
        <div className="space-y-2">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <CalendarIcon className="size-3.5" />
              <span>{formatedStartTime}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <ClockIcon className="size-3.5" />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="w-full aspect-video bg-muted/50 rounded-lg flex items-center justify-center cursor-pointer group"
          onClick={() => window.open(recordings.url, "_blank")}
        >
          <div className="size-12 rounded-full bg-background/90 flex items-center justify-center group-hover:bg-primary transition-colors">
            <PlayIcon className="size-6 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          className="flex-1"
          onClick={() => window.open(recordings.url, "_blank")}
        >
          <PlayIcon className="size-4 mr-2" />
          <span className="text-sm">Play Recording</span>
        </Button>
        <Button variant={"secondary"} onClick={handleCopyLink}>
          <CopyIcon className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecordingCard;
