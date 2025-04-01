import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";

const VideoCall: React.FC = () => {
  const [yourId, setYourId] = useState<string>("");
  const [users, setUsers] = useState<Set<string>>(new Set());
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<any>();
  const [callAccepted, setCallAccepted] = useState(false);

  const yourVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);
  const socket = useRef<any>(null);

  useEffect(() => {
    // Initialize Socket.IO client
    socket.current = io(process.env.REACT_APP_BE_URL); // Default NestJS WS port

    socket.current.on("your-id", (data: { id: string }) => {
      setYourId(data.id);
    });

    socket.current.on("user-connected", (data: { id: string }) => {
      setUsers((prev) => new Set(prev).add(data.id));
    });

    socket.current.on("user-disconnected", (data: { id: string }) => {
      setUsers((prev) => {
        const newUsers = new Set(prev);
        newUsers.delete(data.id);
        return newUsers;
      });
    });

    socket.current.on("call-made", (data: { from: string; signal: any }) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    socket.current.on("call-accepted", (data: { signal: any }) => {
      setCallAccepted(true);
      if (connectionRef.current) {
        connectionRef.current.signal(data.signal);
      }
    });

    // Get media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (yourVideo.current) {
          yourVideo.current.srcObject = stream;
        }
      });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const callPeer = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream || undefined,
    });

    peer.on("signal", (signal) => {
      socket.current.emit("call-user", {
        to: id,
        signal: signal,
        from: yourId,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    connectionRef.current = peer;
  };

  const acceptCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream || undefined,
    });

    peer.on("signal", (signal) => {
      socket.current.emit("answer-call", {
        signal: signal,
        to: caller,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  return (
    <div>
      <div>
        <h4>Your ID: {yourId}</h4>
        <video
          playsInline
          muted
          ref={yourVideo}
          autoPlay
          style={{ width: "300px" }}
        />
      </div>

      <div>
        <h4>Available users:</h4>
        {Array.from(users).map((id) => (
          <button key={id} onClick={() => callPeer(id)}>
            Call {id}
          </button>
        ))}
      </div>

      <div>
        {receivingCall && !callAccepted && (
          <div>
            <h4>{caller} is calling you</h4>
            <button onClick={acceptCall}>Accept</button>
          </div>
        )}
      </div>

      <div>
        <h4>Other user:</h4>
        <video
          playsInline
          ref={userVideo}
          autoPlay
          style={{ width: "300px" }}
        />
      </div>
    </div>
  );
};

export default VideoCall;
