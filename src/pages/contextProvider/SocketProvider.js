import React, { createContext, useContext, useRef, useEffect } from "react";

const SocketContext = createContext();

export function useSocketRef() {
  const socketRef = useContext(SocketContext);
  if (!socketRef) {
    throw new Error("useSocketRef must be used within a SocketProvider");
  }
  return socketRef;
}

export function SocketProvider({ children }) {
  const socketRef = useRef(null);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
}
