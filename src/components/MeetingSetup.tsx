import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { CameraIcon, MicIcon, SettingsIcon } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

const MeetingSetup = ({ onSetupComplete }: { onSetupComplete: () => void }) => {
  const [isCameraDisable, setIsCameraDisable] = useState(true);
  const [isMicrophoneDisable, setIsMicrophoneDisable] = useState(false);

  const call = useCall();

  if (!call) return null;

  useEffect(() => {
    if (!call) return;
    if (isCameraDisable) call.camera.disable();
    else call.camera.enable();
  }, [isCameraDisable, call.camera]);

  useEffect(() => {
    if (!call) return;

    if (isMicrophoneDisable) call.microphone.disable();
    else call.microphone.enable();
  }, [isMicrophoneDisable, call.microphone]);

  const handleJoinMeeting = async () => {
    await call.join();
    onSetupComplete();
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background/95">
      <div className="w-full max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Video Preview Section */}
          <Card className="md:col-span-1 p-6 flex flex-col">
            <div>
              <h1 className="text-xl font-semibold mb-1">Camera Preview</h1>
              <p className="text-sm text-muted-foreground">
                Make sure you look good!
              </p>
            </div>

            {/* Video Preview */}
            <div className="mt-4 flex-1 min-h-[400px] rounded-xl overflow-hidden bg-muted/50 border relative">
              <div className="absolute inset-0">
                <VideoPreview className="size-full" />
              </div>
            </div>
          </Card>

          {/* Actions control */}
          <Card className="md:col-span-1 p-6">
            <div className="h-full flex flex-col">
              {/* Meeting details */}
              <div>
                <h1 className="text-xl font-semibold mb-1">Meeting Details</h1>
                <p className="text-sm text-muted-foreground break-all">
                  {call.id}
                </p>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-6 mt-8">
                  {/* Camera actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CameraIcon className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Camera</p>
                        <p className="text-sm text-muted-foreground">
                          {isCameraDisable ? "Off" : "On"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={!isCameraDisable}
                      onCheckedChange={(checked) => setIsCameraDisable(!checked)}
                      aria-label="Toggle Camera"
                    />
                  </div>

                  {/* Microphone actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MicIcon className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Microphone</p>
                        <p className="text-sm text-muted-foreground">
                          {isMicrophoneDisable ? "Off" : "On"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={!isMicrophoneDisable}
                      onCheckedChange={(checked) => setIsMicrophoneDisable(!checked)}
                      aria-label="Toggle Microphone"
                    />
                  </div>

                  {/* Device settings */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <SettingsIcon className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Settings</p>
                        <p className="text-sm text-muted-foreground">
                          Configure devices
                        </p>
                      </div>
                    </div>
                    <DeviceSettings />
                  </div>
                </div>

                {/* Join meeting button */}
                <div className="space-y-3 mt-8">
                  <Button
                    className="w-full"
                    size={"lg"}
                    onClick={handleJoinMeeting}
                  >
                    Join Meeting
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Don&apos;t forget to turn on your camera and microphone
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MeetingSetup;
