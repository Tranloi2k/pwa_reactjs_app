// import { useEffect, useRef, useState } from "react";
// import Peer, { SignalData } from "simple-peer";
// import io, { Socket } from "socket.io-client";

// interface CallData {
//   from: string;
//   signal: SignalData;
// }

// interface WebRTCState {
//   myId: string;
//   users: string[];
//   stream?: MediaStream;
//   call?: CallData;
//   callAccepted: boolean;
//   callEnded: boolean;
//   me: string;
//   name: string;
// }

// export const useWebRTC = (roomId: string) => {
//   const [state, setState] = useState<WebRTCState>({
//     myId: "",
//     users: [],
//     callAccepted: false,
//     callEnded: false,
//     me: "",
//     name: "User-" + Math.random().toString(36).substr(2, 5),
//   });

//   const myVideo = useRef<HTMLVideoElement>(null);
//   const userVideo = useRef<HTMLVideoElement>(null);
//   const connectionRef = useRef<Peer.Instance>(null);
//   const socketRef = useRef<Socket>(undefined);
//   const myStream = useRef<MediaStream>(undefined);
//   const beUrl = process.env.REACT_APP_WS_URL;

//   useEffect(() => {
//     // Kết nối Socket.IO
//     socketRef.current = io(beUrl, { path: "/ws" });

//     // Lấy media stream
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         myStream.current = stream;
//         if (myVideo.current) {
//           myVideo.current.srcObject = stream;
//         }

//         // Tham gia phòng
//         socketRef.current?.emit("join-room", roomId);
//       });

//     // Xử lý các sự kiện từ server
//     socketRef.current.on("your-id", (res: { id: string }) => {
//       const id = res.id;
//       setState((prev) => ({ ...prev, myId: id, me: id }));
//     });

//     socketRef.current.on("user-list", (res: { users: string[] }) => {
//       const users = res.users;
//       if (users?.length > 0) {
//         setState((prev) => ({
//           ...prev,
//           users: users.filter((u) => u !== prev.me),
//         }));
//       }
//     });

//     socketRef.current.on("call-made", (data: CallData) => {
//       console.log(data, "data");
//       setState((prev) => ({ ...prev, call: data }));
//     });

//     socketRef.current.on("answer-made", (data: CallData) => {
//       console.log(data, "data");
//       setState((prev) => ({ ...prev, callAccepted: true }));
//       if (connectionRef.current) {
//         connectionRef.current.signal(data.signal); // Thiết lập kết nối
//       }
//     });

//     socketRef.current.on("call-accepted", (signal: SignalData) => {
//       setState((prev) => ({ ...prev, callAccepted: true }));
//       connectionRef.current?.signal(signal);
//     });

//     socketRef.current.on("call-rejected", () => {
//       endCall();
//       alert("Cuộc gọi đã bị từ chối");
//     });

//     // Dọn dẹp khi unmount
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//       if (myStream.current) {
//         myStream.current.getTracks().forEach((track) => track.stop());
//       }
//       if (connectionRef.current) {
//         connectionRef.current.destroy();
//       }
//     };
//   }, [roomId]);

//   const callUser = (id: string) => {
//     const peer = new Peer({
//       initiator: true,
//       trickle: false,
//       stream: myStream.current,
//     });

//     peer.on("signal", (signal) => {
//       socketRef.current?.emit("call-user", {
//         to: id,
//         signal,
//         from: state.me,
//       });
//     });

//     peer.on("stream", (stream) => {
//       console.log("Stream trạng thái:", {
//         active: stream.active, // true = tốt
//         videoTracks: stream.getVideoTracks().length, // Phải > 0
//         audioTracks: stream.getAudioTracks().length, // Có thể 0 nếu chỉ có video
//       });

//       if (userVideo.current) {
//         userVideo.current.srcObject = stream;
//         userVideo.current.play().catch((e) => {
//           console.error("Lỗi play video:", e); // Quan trọng: bắt lỗi play
//         });
//       }
//     });

//     peer.on("error", (err) => {
//       console.error("Peer error:", err);
//       endCall();
//     });

//     connectionRef.current = peer;
//   };

//   const answerCall = () => {
//     console.log("answer call");
//     setState((prev) => ({ ...prev, callAccepted: true }));

//     const peer = new Peer({
//       initiator: false,
//       trickle: false,
//       stream: myStream.current,
//     });

//     peer.on("signal", (signal) => {
//       socketRef.current?.emit("answer-call", {
//         signal,
//         to: state.call?.from,
//       });
//     });

//     peer.on("stream", (stream) => {
//       console.log("Nhận stream - Chi tiết:", {
//         active: stream.active,
//         id: stream.id,
//         tracks: {
//           video: stream.getVideoTracks().map((t) => ({
//             enabled: t.enabled,
//             readyState: t.readyState,
//             muted: t.muted,
//           })),
//           audio: stream.getAudioTracks().length,
//         },
//       });

//       if (!userVideo.current) {
//         console.error("Thẻ video chưa được khởi tạo");
//         return;
//       }

//       // Gán stream
//       userVideo.current.srcObject = stream;

//       // Xử lý autoplay policy
//       const playPromise = userVideo.current.play();

//       if (playPromise !== undefined) {
//         playPromise.catch((e) => {
//           console.error("Autoplay bị chặn:", e);
//           // Hiển thị nút play yêu cầu user tương tác
//         });
//       }

//       // Theo dõi thay đổi track
//       stream.onaddtrack = (e) => {
//         console.log("Track mới được thêm:", e.track);
//       };
//     });

//     peer.on("error", (err) => {
//       console.error("Peer error:", err);
//       endCall();
//     });

//     if (state.call?.signal) {
//       peer.signal(state.call.signal);
//     }

//     connectionRef.current = peer;
//   };

//   const rejectCall = () => {
//     if (state.call?.from) {
//       socketRef.current?.emit("reject-call", { to: state.call.from });
//     }
//     setState((prev) => ({ ...prev, call: undefined }));
//   };

//   const endCall = () => {
//     if (connectionRef.current) {
//       connectionRef.current.destroy();
//       connectionRef.current = null;
//     }
//     setState((prev) => ({
//       ...prev,
//       call: undefined,
//       callAccepted: false,
//       callEnded: true,
//     }));
//     if (userVideo.current) {
//       userVideo.current.srcObject = null;
//     }
//   };

//   const toggleAudio = () => {
//     if (myStream.current) {
//       myStream.current.getAudioTracks().forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   const toggleVideo = () => {
//     if (myStream.current) {
//       myStream.current.getVideoTracks().forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//     }
//   };

//   return {
//     ...state,
//     myVideo,
//     userVideo,
//     callUser,
//     answerCall,
//     rejectCall,
//     endCall,
//     toggleAudio,
//     toggleVideo,
//   };
// };
