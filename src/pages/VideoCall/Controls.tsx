// import React from "react";
// import {
//   FaPhone,
//   FaPhoneSlash,
//   FaMicrophone,
//   FaMicrophoneSlash,
//   FaVideo,
//   FaVideoSlash,
// } from "react-icons/fa";

// interface ControlsProps {
//   users: string[];
//   call?: any;
//   callAccepted: boolean;
//   callUser: (id: string) => void;
//   answerCall: () => void;
//   rejectCall: () => void;
//   endCall: () => void;
//   toggleAudio: () => void;
//   toggleVideo: () => void;
//   isAudioOn: boolean;
//   isVideoOn: boolean;
// }

// export const Controls: React.FC<ControlsProps> = ({
//   users,
//   call,
//   callAccepted,
//   callUser,
//   answerCall,
//   rejectCall,
//   endCall,
//   toggleAudio,
//   toggleVideo,
//   isAudioOn,
//   isVideoOn,
// }) => {
//   return (
//     <div className="controls-container">
//       {!callAccepted && !call && (
//         <div className="user-list">
//           <h3>Người dùng online:</h3>
//           {users.length > 0 ? (
//             <ul>
//               {users.map((user) => (
//                 <li key={user}>
//                   <button onClick={() => callUser(user)}>
//                     <FaPhone /> Gọi {user}...
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>Không có người dùng nào khác online</p>
//           )}
//         </div>
//       )}

//       {call && !callAccepted && (
//         <div className="incoming-call">
//           <h3>Cuộc gọi đến từ {call.from}...</h3>
//           <div className="call-buttons">
//             <button onClick={answerCall} className="accept">
//               <FaPhone /> Nhận cuộc gọi
//             </button>
//             <button onClick={rejectCall} className="reject">
//               <FaPhoneSlash /> Từ chối
//             </button>
//           </div>
//         </div>
//       )}

//       {(callAccepted || call) && (
//         <div className="call-controls">
//           <button onClick={toggleAudio} className={isAudioOn ? "active" : ""}>
//             {isAudioOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
//           </button>
//           <button onClick={endCall} className="end-call">
//             <FaPhoneSlash />
//           </button>
//           <button onClick={toggleVideo} className={isVideoOn ? "active" : ""}>
//             {isVideoOn ? <FaVideo /> : <FaVideoSlash />}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };
