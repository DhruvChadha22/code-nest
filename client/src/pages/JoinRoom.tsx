import { Button } from "@/components/ui/button";
import { useLocalPeer } from "@/store/useLocalPeer";
import { useSocket } from "@/store/useSocket";
import { useUser } from "@/store/useUser";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as UUIDv4 } from "uuid";
import MediaPlayer from "@/components/MediaPlayer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Mic, MicOff, TriangleAlert, Video, VideoOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const JoinRoom = () => {
    const [roomId, setRoomId] = useState<string>("");
    const [isLoadingStream, setIsLoadingStream] = useState<boolean>(true);
    const [mediaStreamError, setMediaStreamError] = useState<string>("");
    const [isJoiningRoom, setIsJoiningRoom] = useState<boolean>(false);
    const [formError, setFormError] = useState<string>("");

    const { setUserId, setUsername, setVideoEnabled, setAudioEnabled } = useUser();
    const { localStream, setPeer, setLocalStream, clearLocalPeer } = useLocalPeer();

    const hasJoinedRoomRef = useRef<boolean>(false);

    const { socket } = useSocket();
    const navigate = useNavigate();
    
    useEffect(() => {
        const id = UUIDv4();
        setUserId(id);

        const newPeer = new Peer(id, {
            config: {
                "iceServers": [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:stun.l.google.com:5349" },
                    { urls: "stun:stun1.l.google.com:3478" },
                    { urls: "stun:stun1.l.google.com:5349" },
                ],
            },
        });
        setPeer(newPeer);

        fetchUserMedia();

        socket.on("room-created", joinNewRoom);
        socket.on("room-joined", enterRoom);
        socket.on("room-not-found", roomNotFound);

        const handleBeforeUnload = () => {
            clearLocalPeer();
            cleanupJoinRoom();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            
            cleanupJoinRoom();
            if (!hasJoinedRoomRef.current) {
                clearLocalPeer();
            }
        };
    }, []);

    const fetchUserMedia = async () => {
        try {
            setIsLoadingStream(true);
            setMediaStreamError("");

            // Clear old stream and its tracks
            setLocalStream(null);

            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error("Your browser doesn't support camera/microphone access. Please use the latest version of Chrome, Firefox, or Edge.");
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 320 },
                    height: { ideal: 240 },
                    frameRate: { ideal: 15, max: 30 },
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            setLocalStream(stream);
        } catch(err: any) {
            if (err.name === "NotAllowedError") {
                setMediaStreamError("Permission denied for camera/microphone");
            } else if (err.name === "NotFoundError") {
                setMediaStreamError("No camera or microphone found");
            } else if (err.name === "NotReadableError") {
                setMediaStreamError("Device is already in use by another application");
            } else {
                setMediaStreamError("Error accessing media devices: " + (err?.message || String(err)));
            }
        } finally {
            setIsLoadingStream(false);
        }
    };

    const toggleVideo = () => {
        const videoTrack = localStream?.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setVideoEnabled(videoTrack.enabled);
        }
    };

    const toggleAudio = () => {
        const audioTrack = localStream?.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setAudioEnabled(audioTrack.enabled);
        }
    };

    const initRoom = () => {
        const { username } = useUser.getState();
        
        if (username.trim() === "") {
            setFormError("Username is required");
            return;
        }
        
        setFormError("");
        setIsJoiningRoom(true);
        socket.emit("create-room");
    };

    const joinNewRoom = ({ roomId }: { roomId: string }) => {
        const { userId, username } = useUser.getState();

        if (username.trim() === "") {
            setFormError("Username is required");
            setIsJoiningRoom(false);
            return;
        }

        socket.emit("join-room", { roomId, userId, username });;
    };

    const joinExistingRoom = () => {
        const { userId, username } = useUser.getState();

        if (username.trim() === "") {
            setFormError("Username is required");
            return;
        }
        if (!roomId) {
            setFormError("Room ID is required");
            return;
        }

        setFormError("");
        setIsJoiningRoom(true);
        socket.emit("join-room", { roomId, userId, username });
    };

    const enterRoom = ({ roomId }: { roomId: string }) => {
        hasJoinedRoomRef.current = true;
        setIsJoiningRoom(false);

        toast.success("Room Joined!", {
            unstyled: true,
            classNames: {
                toast: "bg-[#256ddb] flex items-center justify-center font-medium text-gray-300 p-4 rounded-lg",
                icon: "flex items-center size-6 mr-2"
            },
        });
        navigate(`/room/${roomId}`);
    };

    const roomNotFound = () => {
        setIsJoiningRoom(false);
        toast.error("Room NOT Found!", {
            unstyled: true,
            classNames: {
                toast: "bg-[#256ddb] flex items-center justify-center font-medium text-gray-300 p-4 rounded-lg",
                icon: "flex items-center size-6 mr-2"
            },
        });
    };

    const cleanupJoinRoom = () => {
        socket.off("room-created", joinNewRoom);
        socket.off("room-joined", enterRoom);
        socket.off("room-not-found", roomNotFound);
    };

    return (
        <div className="min-h-screen min-w-screen bg-[#080E28] flex flex-col justify-center items-center gap-4">
            <Card className="w-xs sm:w-sm bg-[#101636] border-none">
                <CardHeader className="flex flex-col items-center justify-center">
                    <CardTitle className="text-xl text-white">Join Room</CardTitle>
                    <CardDescription className="text-gray-300">
                        Create new room or join an existing one
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6 text-white">
                        <div className="flex flex-col items-center justify-center">
                            {isLoadingStream ? (
                                <div className="w-xs lg:w-sm flex items-center justify-center">
                                    <div className="w-2/3 mb-6">
                                        <div className="bg-[#283061] flex items-center justify-center rounded-lg w-[210px] lg:w-[calc(100%-3px)] h-[130px] lg:h-[calc(1/5*100vh-8px)]">
                                            <Loader2 className="size-10 stroke-[#256ddb] animate-spin" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-xs lg:w-sm flex items-center justify-center">
                                    {!!mediaStreamError ? (
                                        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                                            <TriangleAlert className="size-4" />
                                            <p>{mediaStreamError}</p>
                                        </div>
                                    ) : (
                                        <div className="w-2/3">
                                            <MediaPlayer 
                                                stream={localStream} 
                                                username={useUser.getState().username} 
                                                isAudioEnabled={useUser.getState().audioEnabled} 
                                                isVideoEnabled={useUser.getState().videoEnabled}
                                                isLocalStream={true}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center justify-center gap-2">
                                <Button 
                                    variant={useUser.getState().videoEnabled ? "default" : "destructive"}
                                    onClick={toggleVideo}
                                    size="lg"
                                    disabled={isLoadingStream}
                                    className={cn("rounded-full size-12 cursor-pointer transition-all", !!mediaStreamError && "hidden")}
                                >
                                    {useUser.getState().videoEnabled ? <Video className="size-5" /> : <VideoOff className="size-5" />}
                                </Button>
                                <Button 
                                    variant={useUser.getState().audioEnabled ? "default" : "destructive"}
                                    onClick={toggleAudio}
                                    size="lg"
                                    disabled={isLoadingStream}
                                    className={cn("rounded-full size-12 cursor-pointer transition-all", !!mediaStreamError && "hidden")}
                                >
                                    {useUser.getState().audioEnabled ? <Mic className="size-5" /> : <MicOff className="size-5" />}
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter Username"
                                onChange={e => setUsername(e.target.value)}
                                disabled={isJoiningRoom}
                                className="border-[#256DDB] focus-visible:border-[#256DDB] focus-visible:ring-[#283061]"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="roomId">Room ID</Label>
                            <Input
                                id="roomId"
                                type="text" 
                                placeholder="Enter Room ID"
                                disabled={isJoiningRoom}
                                className="border-[#256DDB] focus-visible:border-[#256DDB] focus-visible:ring-[#283061]"
                                onChange={e => setRoomId(e.target.value)}
                            />
                        </div>

                        {!!formError && (
                            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                                <TriangleAlert className="size-4" />
                                <p>{formError}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button 
                        className="w-full hover:cursor-pointer"
                        onClick={joinExistingRoom}
                        disabled={isLoadingStream || isJoiningRoom || !!mediaStreamError}
                    >
                        {isJoiningRoom ? (
                            <>
                                <Loader2 className="size-4 mr-2 animate-spin" />
                                Joining Room...
                            </>
                        ) : (
                            <>
                                Join with Room ID
                            </>
                        )}
                    </Button>
                    <Button 
                        variant="secondary" 
                        className="w-full hover:cursor-pointer"
                        onClick={initRoom}
                        disabled={isLoadingStream || isJoiningRoom || !!mediaStreamError}
                    >
                        {isJoiningRoom ? (
                            <>
                                <Loader2 className="size-4 mr-2 animate-spin" />
                                Creating Room...
                            </>
                        ) : (
                            <>
                                Create a new Room
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default JoinRoom;
