// import React, { useState } from "react";
// import { useWebRTC } from "../../hooks/useWebRTC";
// import { VideoPlayer } from "./VideoPlayer";
// import { Controls } from "./Controls";
// import "./styles.css";

// const VideoCall = () => {
//   const [roomId, setRoomId] = useState("default-room");
//   const [joined, setJoined] = useState(false);
//   const [isAudioOn, setIsAudioOn] = useState(true);
//   const [isVideoOn, setIsVideoOn] = useState(true);

//   const {
//     myVideo,
//     userVideo,
//     users,
//     call,
//     callAccepted,
//     callUser,
//     answerCall,
//     rejectCall,
//     endCall,
//     toggleAudio,
//     toggleVideo,
//   } = useWebRTC(joined ? roomId : "");

//   const handleToggleAudio = () => {
//     toggleAudio();
//     setIsAudioOn((prev) => !prev);
//   };

//   const handleToggleVideo = () => {
//     toggleVideo();
//     setIsVideoOn((prev) => !prev);
//   };

//   if (!joined) {
//     return (
//       <div className="join-room">
//         <h1>Tham gia phòng</h1>
//         <input
//           type="text"
//           value={roomId}
//           onChange={(e) => setRoomId(e.target.value)}
//           placeholder="Nhập ID phòng"
//         />
//         <button onClick={() => setJoined(true)}>Tham gia</button>
//       </div>
//     );
//   }

//   return (
//     <div className="video-call-container">
//       <h1>Phòng: {roomId}</h1>

//       <VideoPlayer
//         myVideo={myVideo}
//         userVideo={userVideo}
//         isCallActive={callAccepted || !!call}
//       />

//       <Controls
//         users={users}
//         call={call}
//         callAccepted={callAccepted}
//         callUser={callUser}
//         answerCall={answerCall}
//         rejectCall={rejectCall}
//         endCall={endCall}
//         toggleAudio={handleToggleAudio}
//         toggleVideo={handleToggleVideo}
//         isAudioOn={isAudioOn}
//         isVideoOn={isVideoOn}
//       />
//     </div>
//   );
// };

const VideoCall = () => {
  return <></>;
};

export default VideoCall;
