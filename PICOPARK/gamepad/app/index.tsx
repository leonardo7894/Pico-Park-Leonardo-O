import React, { useState, useEffect } from "react";
import { StatusBar, Alert } from "react-native";

import ConnectionScreen from "../screens/ConnectionScreen";
import GamepadScreen from "../screens/GamepadScreen";
import { useGameSocket } from "../hooks/useGameSocket";

export default function App() {
  const [address, setAddress] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);

  const { connected, player, hasConnected, error, sendInput } = useGameSocket(address || "");

  // Si se agotan los reintentos (o la sala está llena) volvemos a la pantalla de IP
  // y mostramos el error ahí, sin Alert que pueda pisar una conexión exitosa.
  useEffect(() => {
    if (error && address && !connected) {
      setConnectError(error);
      setAddress(null);
    }
  }, [error, address, connected]);

  // Una vez que conectó alguna vez, se muestra el gamepad (aunque haya una
  // reconexión momentánea, el estado se ve en la barra superior).
  if (!address || !hasConnected) {
    return (
      <ConnectionScreen
        connecting={!!address}
        error={connectError}
        onCancel={() => setAddress(null)}
        onConnect={(addr) => {
          const ipRegex = /^[0-9a-zA-Z.:_-]+$/;
          if (!ipRegex.test(addr) || addr.trim().length < 4) {
            Alert.alert("IP Inválida", "Por favor ingresá una dirección correcta (Ej: 192.168.1.45:3000)");
            return;
          }
          setConnectError(null);
          setAddress(addr);
        }}
      />
    );
  }

  return (
    <>
      <StatusBar hidden />

      <GamepadScreen
        address={address}
        connected={connected}
        player={player}
        sendInput={sendInput}
        onDisconnect={() => setAddress(null)}
      />
    </>
  );
}