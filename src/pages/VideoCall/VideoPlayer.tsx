// import React from "react";

// interface VideoPlayerProps {
//   myVideo: React.RefObject<HTMLVideoElement | null>;
//   userVideo: React.RefObject<HTMLVideoElement | null>;
//   isCallActive: boolean;
// }

// export const VideoPlayer: React.FC<VideoPlayerProps> = ({
//   myVideo,
//   userVideo,
//   isCallActive,
// }) => {
//   return (
//     <div className="video-container">
//       <div className={`video-box ${isCallActive ? "small" : "large"}`}>
//         <video
//           playsInline
//           muted
//           ref={myVideo}
//           autoPlay
//           className="video-element"
//         />
//         <span className="video-label">Bạn</span>
//       </div>

//       {isCallActive && (
//         <div className="video-box large">
//           <video
//             playsInline
//             ref={userVideo}
//             autoPlay
//             className="video-element"
//           />
//           <span className="video-label">Người gọi</span>
//         </div>
//       )}
//     </div>
//   );
// };
