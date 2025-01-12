import MyContext from "@/Context/MyContext";
import socket from "@/Socket/Socket";
import { PlayIcon, Square } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CiMicrophoneOff, CiMicrophoneOn } from "react-icons/ci";

const AudioChat = () => {
  const [isStreaming, setIsStreaming] = useState(false);

  const [localStream, setLocalStream] = useState(null);
  const peerConnectionRef = useRef(null);
  const remoteAudioRef = useRef(null);

  const [isOpenMicro, setOpenMicro] = useState(false);
  const { canEditDocs, user, allowToAddCollaborator } = useContext(MyContext);

  //   --------------------FUNCTION TO START AUDIO STREAMING ---------------------------

  const stopStreaming = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
      setIsStreaming(false);
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  };

  const startStreaming = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setLocalStream(stream);
    setIsStreaming(true);

    await setUpMediaConfiguration(stream);
    sendICECandidate();
  };

  //   FUNCTION TO SETUP MEDIA CONFIGURATION TO SHARE MEDIA, Offer, ICE Candidate

  const setUpMediaConfiguration = async (stream) => {
    // Creating new RTCPeerConnection
    const peerConnection = new RTCPeerConnection();
    peerConnectionRef.current = peerConnection;

    // Adding local audio streams to the peer connection
    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));

    // Handle the remote audio stream
    peerConnection.ontrack = (event) => {
      console.log("Received remote stream", event.streams[0]);
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0]; // Attach the remote stream to the audio element
      }
    };

    //Create offer and send it to signaling server / socket.io in our case
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    console.log("created offer: ", offer);
    //Sending thsi offer to the signaling server
    socket.emit("WebRTC-offer", offer);
  };

  const sendICECandidate = () => {
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Generated ICE Candidate: ", event.candidate);
        socket.emit("ice-candidate", event.candidate);
      }
    };
  };

  const startSession = async () => {
    // e.preventDefault();
    console.log(isStreaming);
    if (isStreaming) {
      // If streaming is active, stop it

      stopStreaming();
      setIsStreaming(false);
      setOpenMicro(false);
      console.log("Streaming Stopped");
    } else {
      // If streaming is not active, start it
      setIsStreaming(true);
      await startStreaming();
      console.log("Streaming Started");
    }
  };

  //   For browser 2 to handle that offer, iceCandidate, and to generat eanswer and iceCandidate

  const handleOffer = async (offer) => {
    const peerConnection = new RTCPeerConnection();
    peerConnectionRef.current = peerConnection;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));

    peerConnection.ontrack = (event) => {
      console.log("Received remote stream", event.streams[0]);
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    await peerConnection.setRemoteDescription(offer);

    //Then creates an answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    console.log("Created answer", answer);
    socket.emit("webRTC-answer", answer);

    sendICECandidate();
  };

  //For Browser 1 to handle answer
  const handleAnswer = async (answer) => {
    if (peerConnectionRef.current) {
      console.log("recieved answer", answer);
      await peerConnectionRef.current.setRemoteDescription(answer);
    }
  };

  //Both browser can handle this
  const handleICECandidate = async (candidate) => {
    console.log("Recieved candidate", candidate);

    if (peerConnectionRef.current) {
      await peerConnectionRef.current.addIceCandidate(candidate);
    }
  };

  useEffect(() => {
    startSession();

    socket.on("webRTC-offer", (offer) => {
      handleOffer(offer);
    });

    socket.on("webRTC-answer", (answer) => {
      handleAnswer(answer);
    });

    socket.on("ice-candidate", (candidate) => {
      handleICECandidate(candidate);
    });

    return () => {
      socket.off("webRTC-offer");
      socket.off("webRTC-answer");
      socket.off("ice-candidate");
    };
  }, []);

  return (
    <>
      {/* {allowToAddCollaborator === user?.userId && ( */}
      <div className="fixed top-[40vh] left-[20px] z-[10] bg-blue-50 rounded-md w-[250px] flex flex-col px-1 py-4">
        <h1 className="w-full text-lg font-semibold text-center">
          Audio Chat Session
        </h1>
        <hr />
        {/* <button
            onClick={startSession}
            className={`${
              isStreaming
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }  rounded-md flex gap-x-2 items-center text-white py-2 px-3 w-[80%] mx-auto mt-4 transition-all ease-in-out duration-200`}
          >
            {isStreaming ? <Square /> : <PlayIcon />}
            <span className="font-medium">
              {isStreaming ? "End Session" : "Start Session"}
            </span>
          </button> */}

        <audio ref={remoteAudioRef} controls autoPlay></audio>

        {/* {isStreaming && (
            <div
              onClick={() => setOpenMicro((prev) => !prev)}
              className="rounded-md flex gap-x-2 items-center p-2 w-[80%] mx-auto mt-4 cursor-pointer"
            >
              {isOpenMicro ? (
                <>
                  <CiMicrophoneOn className="bg-green-200 rounded-full w-[36px] h-[36px] p-2 text-green-600 hover:bg-green-300 transition-all ease-in-out duration-200" />
                  <span className="text-sm">Mute</span>
                </>
              ) : (
                <>
                  <CiMicrophoneOff className="bg-red-200 rounded-full w-[36px] h-[36px] p-2 text-red-600 hover:bg-red-300 transition-all ease-in-out duration-200" />
                  <span className="text-sm">Unmute </span>
                </>
              )}
            </div>
          )} */}
      </div>
      {/* )} */}

      {/* {allowToAddCollaborator != user?.userId && canEditDocs && (
        <div className="fixed top-[40vh] left-[20px] z-[10] bg-blue-50 rounded-md w-[250px] flex flex-col px-1 py-4">
          <h1 className="w-full text-lg font-semibold text-center">
            Audio Chat Session
          </h1>
          <hr />
          <button
            // onClick={JoinSession}
            className={`${
              isStreaming
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }  rounded-md flex gap-x-2 items-center text-white py-2 px-3 w-[80%] mx-auto mt-4 transition-all ease-in-out duration-200`}
          >
            {isStreaming ? <Square /> : <PlayIcon />}
            <span className="font-medium">
              {isStreaming ? "Leave Session" : "Join Session"}
            </span>
          </button>

          <audio ref={remoteAudioRef} controls autoPlay></audio>

          {isStreaming && (
            <div
              onClick={() => setOpenMicro((prev) => !prev)}
              className="rounded-md flex gap-x-2 items-center p-2 w-[80%] mx-auto mt-4 cursor-pointer"
            >
              {isOpenMicro ? (
                <>
                  <CiMicrophoneOn className="bg-green-200 rounded-full w-[36px] h-[36px] p-2 text-green-600 hover:bg-green-300 transition-all ease-in-out duration-200" />
                  <span className="text-sm">Mute</span>
                </>
              ) : (
                <>
                  <CiMicrophoneOff className="bg-red-200 rounded-full w-[36px] h-[36px] p-2 text-red-600 hover:bg-red-300 transition-all ease-in-out duration-200" />
                  <span className="text-sm">Unmute </span>
                </>
              )}
            </div>
          )}
        </div>
      )} */}
    </>
  );
};

export default AudioChat;
