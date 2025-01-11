import socket from "@/Socket/Socket";
import React, { useEffect, useRef, useState,  } from "react";

const AudioTransmission = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const peerConnectionRef = useRef(null);
  const remoteAudioRef = useRef(null);

  const startStreaming = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setLocalStream(stream);
    setIsStreaming(true);

    await setUpMediaConfiguration(stream);
    sendICECandidate();
  };

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

  const handleOffer = async (offer) => {
    // console.log(offer);

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

  const handleAnswer = async (answer) => {
    if (peerConnectionRef.current) {
      console.log("recieved answer", answer);
      await peerConnectionRef.current.setRemoteDescription(answer);
    }
  };

  const handleICECandidate = async (candidate) => {
    console.log("Recieved candidate", candidate);

    if (peerConnectionRef.current) {
      await peerConnectionRef.current.addIceCandidate(candidate);
    }
  };

  useEffect(() => {
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
    <div>
      <button onClick={isStreaming ? stopStreaming : startStreaming}>
        {isStreaming ? "Stop Sharing" : "Start Sharing"}
      </button>
      <audio ref={remoteAudioRef} controls autoPlay></audio>
    </div>
  );
};

export default AudioTransmission;
