"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io as ClientID } from "socket.io-client";
const WebSocketContext = createContext<any>({
  socket: null,
  isConnected: false,
});

const useSocket = () => {
  return useContext(WebSocketContext);
};

const WebSocketProvider = ({ children }: any) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const socketInstance = new (ClientID as any)("localhost:3001", {
      transports: ["websocket"],
    });

    socketInstance.on("connect", function () {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", function () {
      setIsConnected(false);
    });
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        isConnected,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketProvider, useSocket };
