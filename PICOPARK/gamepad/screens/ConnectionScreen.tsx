import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

interface Props {
  onConnect: (address: string) => void;
  onCancel?: () => void;
  connecting?: boolean;
  error?: string | null;
}

export default function ConnectionScreen({ onConnect, onCancel, connecting, error }: Props) {
  const [address, setAddress] = useState("");

  function connect() {
    if (!address.trim()) {
      Alert.alert("Error", "Ingresá una IP");
      return;
    }

    onConnect(address.trim());
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pico Park Gamepad</Text>

      <Text style={styles.label}>
        Ingresá la IP del servidor
      </Text>

      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Ej: 10.56.2.32:3000"
        placeholderTextColor="#777"
        style={styles.input}
        autoCapitalize="none"
      />

      {error && !connecting ? <Text style={styles.error}>{error}</Text> : null}

      {connecting ? (
        <TouchableOpacity style={[styles.button, styles.buttonBusy]} onPress={onCancel}>
          <Text style={styles.buttonText}>Conectando... (tocar para cancelar)</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={connect}>
          <Text style={styles.buttonText}>Conectar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 34,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 30,
  },

  label: {
    color: "#ccc",
    fontSize: 18,
    marginBottom: 10,
  },

  input: {
    width: "100%",
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#444",
  },

  button: {
    backgroundColor: "#2ecc71",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },

  buttonBusy: {
    backgroundColor: "#f39c12",
  },

  error: {
    color: "#ff7675",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "left",
    width: "100%",
  },

  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});