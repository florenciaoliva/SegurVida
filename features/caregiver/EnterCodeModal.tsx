import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface EnterCodeModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EnterCodeModal: React.FC<EnterCodeModalProps> = ({ visible, onClose, onSuccess }) => {
  const [code, setCode] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const connectCaregiver = useMutation(api.connectionCodes.connectCaregiver);

  const handlePasteCode = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      // Clean the pasted text to only include digits
      const cleaned = text.replace(/[^0-9]/g, "").slice(0, 6);
      if (cleaned.length === 6) {
        setCode(cleaned);
      } else {
        Alert.alert(
          "Código inválido",
          "El texto copiado no contiene un código de 6 dígitos válido"
        );
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo pegar el código");
    }
  };

  const handleConnect = async () => {
    if (code.length !== 6) {
      Alert.alert("Error", "El código debe tener 6 dígitos");
      return;
    }

    setIsConnecting(true);
    try {
      await connectCaregiver({ code });
      Alert.alert("¡Éxito!", "Te has conectado con el usuario correctamente");
      setCode("");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "No se pudo conectar. Verifica el código e intenta de nuevo."
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleClose = () => {
    setCode("");
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={handleClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="m-5 bg-white rounded-2xl p-8 items-center shadow-lg w-11/12 max-w-sm">
          <TouchableOpacity className="absolute right-2 top-2" onPress={handleClose}>
            <Ionicons name="close-circle" size={32} color="#666" />
          </TouchableOpacity>

          <View className="mb-5">
            <Ionicons name="link" size={80} color="#2563eb" />
          </View>

          <Text className="text-2xl font-bold mb-4 text-center text-gray-800">
            Conectar con Usuario
          </Text>

          <Text className="text-base text-center mb-5 text-gray-600">
            Ingresa el código de 6 dígitos que te compartió el usuario para conectarte y recibir sus
            alertas de emergencia
          </Text>

          <View className="w-full mb-3">
            <TextInput
              className="border-2 border-gray-300 rounded-lg px-4 py-3 text-center text-2xl font-bold tracking-widest"
              value={code}
              onChangeText={(text) => {
                // Only allow digits and max 6 characters
                const cleaned = text.replace(/[^0-9]/g, "").slice(0, 6);
                setCode(cleaned);
              }}
              placeholder="000000"
              placeholderTextColor="#d1d5db"
              keyboardType="number-pad"
              maxLength={6}
              editable={!isConnecting}
            />
          </View>

          <TouchableOpacity
            className="w-full flex-row items-center justify-center border-2 border-blue-500 rounded-lg py-2 px-5 mb-5"
            onPress={handlePasteCode}
            disabled={isConnecting}
          >
            <Ionicons name="clipboard-outline" size={20} color="#2563eb" />
            <Text className="text-blue-500 text-base font-semibold ml-2">Pegar Código</Text>
          </TouchableOpacity>

          <Text className="text-sm text-gray-400 italic mb-5">
            Asegúrate de ingresar el código antes de que expire
          </Text>

          <View className="flex-row gap-3 w-full">
            <TouchableOpacity
              className="flex-1 border-2 border-gray-300 rounded-lg py-3 px-4"
              onPress={handleClose}
              disabled={isConnecting}
            >
              <Text className="text-gray-700 text-base font-semibold text-center">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 rounded-lg py-3 px-4 ${
                code.length === 6 && !isConnecting ? "bg-blue-500" : "bg-gray-300"
              }`}
              onPress={handleConnect}
              disabled={code.length !== 6 || isConnecting}
            >
              {isConnecting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-base font-semibold text-center">Conectar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
