import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface PlayerInfo {
  id: string;
  color: string;
  name: string;
  index: number;
}

interface GameSocket {
  connected: boolean;
  player: PlayerInfo | null;
  hasConnected: boolean;
  error: string | null;
  sendInput: (key: "left" | "right" | "jump" | "start", pressed: boolean) => void;
}

export function useGameSocket(address: string): GameSocket {
  const socketRef = useRef<Socket | null>(null);

  const [connected, setConnected] = useState(false);
  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [hasConnected, setHasConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setConnected(false);
    setPlayer(null);
    setHasConnected(false);
    if (!address) return;
    setError(null);

    const url = address.startsWith("http") ? address : `http://${address}`;

    console.log("Conectando a:", url);

    const socket = io(url, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 3500,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("CONECTADO AL HOST");
      setConnected(true);
      setHasConnected(true);
      setError(null);
      socket.emit("joinAsPlayer");
    });

    socket.on("playerAssigned", (info: PlayerInfo) => {
      console.log("JUGADOR ASIGNADO:", info);
      setPlayer(info);
    });

    socket.on("gameFull", () => {
      setError("La sala está llena.\nIntentá más tarde.");
      socket.disconnect();
    });

    socket.on("disconnect", () => {
      console.log("DESCONECTADO DEL HOST");
      setConnected(false);
      setPlayer(null);
    });

    // Un connect_error suelto NO es un fallo definitivo: socket.io reintenta solo.
    // Sólo avisamos cuando se agotan los reintentos (reconnect_failed).
    socket.on("connect_error", (err) => {
      console.log("ERROR DE CONEXIÓN SOCKET (reintentando):", err.message);
    });

    socket.io.on("reconnect_failed", () => {
      setConnected(false);
      setPlayer(null);
      setError(
        `No se pudo conectar al Host.

Verificá:
• Que la PC y el celu estén en la misma red Wi-Fi.
• Que el Firewall de Windows no esté bloqueando el puerto.
• Que la IP sea idéntica a la del Host.`
      );
    });

    return () => {
      socket.off("connect");
      socket.off("playerAssigned");
      socket.off("gameFull");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.io.off("reconnect_failed");
      socket.disconnect();
    };
  }, [address]);

  // 🔥 SOLUCIÓN DOBLE VÍA CORREGIDA: Asegura que el backend reciba el Start
  const sendInput = (key: "left" | "right" | "jump" | "start", pressed: boolean) => {
    if (socketRef.current?.connected) {
      if (key === "start") {
        // 1. Si espera evento personalizado, se lo mandamos SÓLO al tocar (true) para no duplicar
        if (pressed) {
          console.log("Emitiendo evento especial: startGame");
          socketRef.current.emit("startGame");
        }
        // 2. Por las dudas, también se lo mandamos como input tradicional (formato estándar)
        socketRef.current.emit("input", { key, pressed });
      } else {
        // Movimientos normales (left, right, jump)
        socketRef.current.emit("input", { key, pressed });
      }
    }
  };

  return {
    connected,
    player,
    hasConnected,
    error,
    sendInput,
  };
}