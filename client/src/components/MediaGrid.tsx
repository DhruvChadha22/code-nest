import { useLocalPeer } from "@/store/useLocalPeer";
import MediaPlayer from "./MediaPlayer";
import { useRemotePeers } from "@/store/useRemotePeers";
import { useEffect } from "react";
import { useSocket } from "@/store/useSocket";
import { useUser } from "@/store/useUser";
import { Button } from "./ui/button";
import type { MediaConnection } from "peerjs";
import { useNavigate } from "react-router-dom";
import { LogOut, Mic, MicOff, UserRoundMinus, UserRoundPlus, Video, VideoOff } from "lucide-react";
import { toast } from "sonner";

const MediaGrid = ({ roomId }: { roomId?: string }) => {
    const { socket } = useSocket();
    const { peer, localStream, clearLocalPeer } = useLocalPeer();
    const { 
        remotePeers, 
        addRemotePeer, 
        removeRemotePeer,
        updateRemotePeerMedia,
        clearRemotePeers
    } = useRemotePeers();
    const { 
        userId, 
        username, 
        setVideoEnabled,
        setAudioEnabled
    } = useUser();

    const navigate = useNavigate();

    useEffect(() => {
        if(!peer || !localStream) return;

        const handleRemotePeerJoined = ({ 
            peerId, 
            peerName, 
            peerVideoEnabled, 
            peerAudioEnabled 
        }: { 
            peerId: string, 
            peerName: string, 
            peerVideoEnabled: boolean, 
            peerAudioEnabled: boolean 
        }) => {
            const { videoEnabled, audioEnabled } = useUser.getState();
            const call = peer.call(peerId, localStream, {
                metadata: { username, videoEnabled, audioEnabled }
            });
            
            call.on("stream", (remoteStream) => {
                addRemotePeer(peerId, remoteStream, peerName, peerVideoEnabled, peerAudioEnabled);
            });

            toast(`${peerName} has joined`, {
                unstyled: true,
                classNames: {
                    toast: "bg-[#256ddb] flex items-center justify-center font-medium text-gray-300 p-4 rounded-lg",
                    icon: "flex items-center size-6 mr-2",
                },
                icon: <UserRoundPlus />,
            });
        };

        socket.on("peer-joined", handleRemotePeerJoined);

        const handleRemotePeerCall = (call: MediaConnection) => {
            const peerName = call.metadata?.username;
            const isVideoEnabled = call.metadata?.videoEnabled;
            const isAudioEnabled = call.metadata?.audioEnabled;

            call.answer(localStream);

            call.on("stream", (remoteStream) => {
                addRemotePeer(call.peer, remoteStream, peerName, isVideoEnabled, isAudioEnabled);
            });
        };

        peer.on("call", handleRemotePeerCall);

        const handleUpdateRemotePeerMedia = ({ 
            peerId, 
            kind, 
            enabled 
        }: { 
            peerId: string, 
            kind: "video" | "audio", 
            enabled: boolean 
        }) => {
            updateRemotePeerMedia(peerId, kind, enabled);
        };

        socket.on("update-media", handleUpdateRemotePeerMedia);

        const handleRemotePeerLeft = ({ peerId }: { peerId: string }) => {
            const currRemotePeers = useRemotePeers.getState().remotePeers;
            const peer = currRemotePeers[peerId];

            if (peer) {
                removeRemotePeer(peerId);

                toast(`${peer.username} has left`, {
                    unstyled: true,
                    classNames: {
                        toast: "bg-[#256ddb] flex items-center justify-center font-medium text-gray-300 p-4 rounded-lg",
                        icon: "flex items-center size-6 mr-2",
                    },
                    icon: <UserRoundMinus />,
                });
            }
        };

        socket.on("peer-left", handleRemotePeerLeft);

        socket.emit("media-ready", { 
            roomId, 
            userId, 
            username, 
            videoEnabled: useUser.getState().videoEnabled, 
            audioEnabled: useUser.getState().audioEnabled,
        });

        const cleanupMediaGrid = () => {
            socket.emit("leave-room", { roomId, userId });

            peer.off("call", handleRemotePeerCall);
            peer.destroy();
            
            clearLocalPeer();
            clearRemotePeers();

            socket.off("peer-joined", handleRemotePeerJoined);
            socket.off("update-media", handleUpdateRemotePeerMedia);
            socket.off("peer-left", handleRemotePeerLeft);
        };

        window.addEventListener("beforeunload", cleanupMediaGrid);

        return () => {
            cleanupMediaGrid();
            window.removeEventListener("beforeunload", cleanupMediaGrid);
        };
    }, [peer, localStream]);

    const toggleVideo = () => {
        const videoTrack = localStream?.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setVideoEnabled(videoTrack.enabled);

            socket.emit("media-toggle", {
                roomId,
                peerId: userId,
                kind: "video",
                enabled: videoTrack.enabled,
            });
        }
    };

    const toggleAudio = () => {
        const audioTrack = localStream?.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setAudioEnabled(audioTrack.enabled);

            socket.emit("media-toggle", {
                roomId,
                peerId: userId,
                kind: "audio",
                enabled: audioTrack.enabled,
            });
        }
    };

    const leaveRoom = () => {
        navigate("/join-room");
    };

    return (
        <div className="w-full bg-[#101636] flex flex-col border-b-2 border-b-[#080E28] lg:border-b-0 lg:border-r-2 lg:border-r-[#080E28]">
            <div className="flex-1 w-full px-4 pt-2 pb-6">
                <h3 className="h-fit text-lg font-medium text-gray-300 mb-4 hidden lg:block">Participants</h3>
                <div className="flex lg:flex-col gap-3 overflow-x-auto w-full lg:h-[calc(100vh-204px)]">
                    <MediaPlayer 
                        stream={localStream} 
                        username={username} 
                        isAudioEnabled={useUser.getState().audioEnabled} 
                        isVideoEnabled={useUser.getState().videoEnabled}
                        isLocalStream={true}
                    />
                    
                    {Object.keys(remotePeers).map((peerId) => (
                        <MediaPlayer 
                            key={peerId}
                            stream={remotePeers[peerId].stream} 
                            username={remotePeers[peerId].username} 
                            isAudioEnabled={remotePeers[peerId].audioEnabled}
                            isVideoEnabled={remotePeers[peerId].videoEnabled}
                            isLocalStream={false}
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 pb-4 lg:pb-6">
                <Button 
                    variant={useUser.getState().videoEnabled ? "default" : "destructive"}
                    onClick={toggleVideo}
                    size="lg"
                    className="rounded-full size-12 cursor-pointer transition-all"
                >
                    {useUser.getState().videoEnabled ? <Video className="size-5" /> : <VideoOff className="size-5" />}
                </Button>
                <Button 
                    variant={useUser.getState().audioEnabled ? "default" : "destructive"}
                    onClick={toggleAudio}
                    size="lg"
                    className="rounded-full size-12 cursor-pointer transition-all"
                >
                    {useUser.getState().audioEnabled ? <Mic className="size-5" /> : <MicOff className="size-5" />}
                </Button>
                <Button 
                    variant="destructive" 
                    onClick={leaveRoom}
                    size="lg"
                    className="rounded-full size-12 cursor-pointer transition-all"
                >
                    <LogOut className="size-5" />
                </Button>
            </div>
        </div>
    );
};

export default MediaGrid;
