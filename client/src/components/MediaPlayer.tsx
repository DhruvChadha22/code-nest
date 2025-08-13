import { MicOff } from "lucide-react";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const MediaPlayer = ({ 
    stream, 
    username, 
    isAudioEnabled, 
    isVideoEnabled,
    isLocalStream
}: { 
    stream: MediaStream | null, 
    username: string, 
    isAudioEnabled: boolean,
    isVideoEnabled: boolean,
    isLocalStream: boolean,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, isVideoEnabled]);

    return (
        <div className="flex flex-col justify-start">
            {
                isVideoEnabled ? 
                    <div className="w-[210px] lg:w-[calc(100%-3px)] h-[130px] lg:h-[calc(1/5*100vh-8px)] rounded-lg overflow-hidden">
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            muted={isLocalStream ? true : !isAudioEnabled}
                            autoPlay
                        />
                    </div>
                :
                    <div className="bg-[#283061] flex items-center justify-center rounded-lg w-[210px] lg:w-[calc(100%-3px)] h-[130px] lg:h-[calc(1/5*100vh-8px)]">
                        <Avatar className="size-14">
                            <AvatarFallback className="bg-[#256ddb] font-medium text-white text-2xl flex items-center justify-center">
                                {username.charAt(0).toUpperCase() || "Y"}
                            </AvatarFallback>
                        </Avatar>
                    </div>
            }
            <div className="flex items-center justify-start">
                <span className="text-md font-normal">{username || "You"}</span>
                {!isAudioEnabled && <MicOff className="h-4 w-4 ml-2 stroke-red-500" />}
            </div>
        </div>
    );
};

export default MediaPlayer;
