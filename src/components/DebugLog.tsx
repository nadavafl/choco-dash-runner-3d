import React, { useEffect, useState } from "react";

const DebugLog: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      setLogs((prev) => [...prev.slice(-20), "[LOG] " + args.join(" ")]);
      originalLog(...args);
    };

    console.error = (...args) => {
      setLogs((prev) => [...prev.slice(-20), "[ERROR] " + args.join(" ")]);
      originalError(...args);
    };

    window.addEventListener("error", (e) => {
      setLogs((prev) => [...prev.slice(-20), "[ERROR EVENT] " + e.message]);
    });

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        maxHeight: "30vh",
        overflowY: "auto",
        backgroundColor: "rgba(0,0,0,0.7)",
        color: "#0f0",
        fontSize: "12px",
        padding: "10px",
        zIndex: 9999,
        fontFamily: "monospace",
      }}
    >
      {logs.map((log, idx) => (
        <div key={idx}>{log}</div>
      ))}
    </div>
  );
};

export default DebugLog;
