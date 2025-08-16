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
import axios from "axios";

const JoinRoom = () => {
    const [roomId, setRoomId] = useState<string>("");
    const [isLoadingStream, setIsLoadingStream] = useState<boolean>(true);
    const [mediaStreamError, setMediaStreamError] = useState<string>("");
    const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);
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

        const setupPeer = async () => {
            try {
                const response = await axios.get(`https://code-nest.metered.live/api/v1/turn/credentials?apiKey=${import.meta.env.VITE_TURN_SERVER_API_KEY}`);
                const iceServers = response.data;

                const newPeer = new Peer(id, {
                    config: {
                        iceServers,
                    },
                });
                setPeer(newPeer);
            } catch (e) {
                console.log(e);
            }
        };

        setupPeer();
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
        setIsCreatingRoom(true);
        socket.emit("create-room");
    };

    const joinNewRoom = ({ roomId }: { roomId: string }) => {
        const { userId, username } = useUser.getState();

        if (username.trim() === "") {
            setFormError("Username is required");
            setIsCreatingRoom(false);
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
        setIsCreatingRoom(false);
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
        <div className="relative z-10 min-h-screen w-full bg-[#080E28] flex flex-col justify-center items-center gap-4">
            <div className="absolute top-1/6 left-1/8 z-0 bg-[radial-gradient(circle_at_center,#273773,#080D27)] blur-3xl size-3/4 rounded-full overflow-hidden" />
            <Card className="relative z-10 w-xs sm:w-sm bg-[#101636] border-none">
                <CardHeader className="flex flex-col items-center justify-center">
                    <CardTitle className="text-xl font-bold text-white">Join Room</CardTitle>
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
                                        <div className="bg-[#283061] flex items-center justify-center rounded-lg max-lg:w-[210px] max-lg:h-[130px] aspect-video">
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
                            <Label htmlFor="username" className="text-lg">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter Username"
                                onChange={e => setUsername(e.target.value)}
                                disabled={isJoiningRoom}
                                className="md:text-[16px] border-[#256DDB] focus-visible:border-[#256DDB] focus-visible:ring-[#283061]"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="roomId" className="text-lg">Room ID</Label>
                            <Input
                                id="roomId"
                                type="text" 
                                placeholder="Enter Room ID"
                                disabled={isJoiningRoom}
                                className="md:text-[16px] border-[#256DDB] focus-visible:border-[#256DDB] focus-visible:ring-[#283061]"
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
                        className="w-full text-md font-bold bg-[linear-gradient(#283dbd,#386BE8)] border-2 border-[#0C1838] hover:border-[#2EF2FF] transition-all duration-500 hover:cursor-pointer"
                        onClick={joinExistingRoom}
                        disabled={isLoadingStream || isJoiningRoom || isCreatingRoom || !!mediaStreamError}
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
                        className="w-full text-md font-bold bg-[linear-gradient(#253575,#162561)] border-2 border-[#0C1838] hover:border-[#2EF2FF] transition-all duration-500 hover:cursor-pointer"
                        onClick={initRoom}
                        disabled={isLoadingStream || isJoiningRoom || isCreatingRoom || !!mediaStreamError}
                    >
                        {isCreatingRoom ? (
                            <>
                                <Loader2 className="size-4 mr-2 animate-spin" />
                                Creating Room...
                            </>
                        ) : (
                            <>
                                Create a New Room
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default JoinRoom;
