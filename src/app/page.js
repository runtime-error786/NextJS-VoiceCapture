"use client";

import { useState, useEffect, useRef } from "react";

export default function MicrophoneComponent() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef(null);

  const startRecording = () => {
    setIsRecording(true);
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      let completeTranscript = ""; 

      for (let i = 0; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript.trim();
        
        completeTranscript += ` ${transcriptPart}`;
      }

      setTranscript(completeTranscript.trim());
    };

    
  

    recognitionRef.current.onend = () => {
      console.log("Speech recognition ended.",isRecording);
      if (!isRecording) {
        console.log("Speech recognition ended.1");
        setTranscript((prevTranscript) => prevTranscript );
        recognitionRef.current.start();
        
      }
    };
    
    recognitionRef.current.start();
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecordingComplete(true);
    }
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const resetTranscript = () => {
    setTranscript("");
    setRecordingComplete(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg transition-transform transform hover:scale-105 duration-300">
        {(isRecording || transcript) && (
          <div className="w-full mb-8 rounded-md border p-6 bg-gray-50 shadow-md transition-all transform hover:scale-102">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {recordingComplete ? "Recording Complete" : "Recording in Progress"}
                </p>
                <p className="text-sm text-gray-600">
                  {recordingComplete ? "Thanks for speaking!" : "Please start speaking..."}
                </p>
              </div>
              {isRecording && (
                <div className="rounded-full w-4 h-4 bg-red-500 animate-pulse" />
              )}
            </div>

            {transcript && (
              <div className="border rounded-md p-4 bg-white shadow-sm transition-all duration-300">
                <p className="text-gray-700 text-lg">{transcript}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center space-x-6">
          {isRecording ? (
            <button
              onClick={handleToggleRecording}
              className="flex items-center justify-center bg-red-600 hover:bg-red-700 active:scale-90 rounded-full w-20 h-20 focus:outline-none shadow-md transition-all transform duration-200 ease-in-out"
            >
              <svg
                className="h-12 w-12 text-white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleToggleRecording}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:scale-90 rounded-full w-20 h-20 focus:outline-none shadow-md transition-all transform duration-200 ease-in-out"
            >
              <svg
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-white"
              >
                <path
                  fill="currentColor"
                  d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                />
              </svg>
            </button>
          )}

          <button
            onClick={resetTranscript}
            className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white active:scale-90 rounded-full px-6 py-3 focus:outline-none shadow-md transition-all transform duration-200 ease-in-out"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}