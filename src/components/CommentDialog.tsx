import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import toast from "react-hot-toast";
import { MessageSquareIcon, StarIcon } from "lucide-react";
import LoaderUI from "./LoaderUI";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { getInterviewerInfo } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format } from "date-fns";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

const CommentDialog = ({ interviewId }: { interviewId: Id<"interviews"> }) => {
  const [isopen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [rating, setRating] = useState("3");

  const addComment = useMutation(api.comments.addComment);
  const users = useQuery(api.users.getUsers);
  const existingCommments = useQuery(api.comments.getComments, {
    interviewId,
  });

  const handleAddComment = async () => {
    if (!comment.trim()) return toast.error("Please enter a comment");

    setIsAddingComment(true);
    try {
      await addComment({
        interviewId,
        content: comment,
        rating: parseInt(rating),
      });

      toast.success("Comment added successfully");
      setComment("");
      setRating("3");
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsAddingComment(false);
    }
  };

  const renderStar = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`size-4 ${star <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  );

  if (existingCommments === undefined || users === undefined)
    return <LoaderUI />;

  return (
    <Dialog open={isopen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="w-full">
          <MessageSquareIcon className="size-4 mr-2" />
          <span>Add Comment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Interview Comment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {existingCommments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm  font-medium">Previous Comments</h4>
                <Badge variant={"outline"}>
                  {existingCommments.length}{" "}
                  {`Comment${existingCommments.length > 1 ? "s" : ""}`}
                </Badge>
              </div>

              {/* Dislay previous comments */}
              <ScrollArea className="h-[240px]">
                <div className="space-y-4">
                  {existingCommments.map((comment) => {
                    const interviewer = getInterviewerInfo(users, interviewId);
                    return (
                      <div
                        className="rounded-lg border p-4 space-y-3"
                        key={comment._id}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="size-8">
                              <AvatarImage
                                src={interviewer.image}
                                alt={interviewer.name}
                              />
                              <AvatarFallback>
                                {interviewer.initials}
                              </AvatarFallback>
                            </Avatar>

                            <div>
                              <p className="text-sm font-medium">
                                {interviewer.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(
                                  new Date(comment._creationTime),
                                  "MMM d yyy hh:mm a"
                                )}
                              </p>
                            </div>
                          </div>
                          {renderStar(comment.rating)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {comment.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="space-y-4">
            {/* Rating */}
            <div className="space-y-2 ">
              <Label>Rating</Label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a rating" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <SelectItem key={star} value={star.toString()}>
                      <div className="flex items-center gap-0.5">
                        {renderStar(star)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label>Your Comment</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Type your comment here"
                className="h-32"
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"} onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleAddComment}>Add Comment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
