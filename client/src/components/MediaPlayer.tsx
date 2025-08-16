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
    }, [stream, isVideoEnabled, isAudioEnabled]);

    return (
        <div className="flex flex-col justify-start">
            <div className="max-lg:w-[210px] max-lg:h-[130px] aspect-video rounded-lg overflow-hidden">
                {!isVideoEnabled && (
                    <div className="w-full h-full bg-[#283061] flex items-center justify-center z-10">
                        <Avatar className="size-13">
                            <AvatarFallback className="bg-[#256ddb] font-medium text-white text-[22px] flex items-center justify-center">
                                {username.charAt(0).toUpperCase() || "Y"}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                )}

                <video
                    ref={videoRef}
                    className={`w-full h-full object-cover ${!isVideoEnabled ? 'invisible' : ''}`}
                    muted={isLocalStream ? true : !isAudioEnabled}
                    autoPlay
                    playsInline
                />
            </div>

            <div className="flex items-center justify-start">
                <span className="text-md font-semibold">{username || "You"}</span>
                {!isAudioEnabled && <MicOff className="h-4 w-4 ml-2 stroke-red-500" />}
            </div>
        </div>
    );
};

export default MediaPlayer;
