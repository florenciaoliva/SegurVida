import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";

interface ConnectionCodeModalProps {
  visible: boolean;
  onClose: () => void;
  code: string | null;
}

export const ConnectionCodeModal: React.FC<ConnectionCodeModalProps> = ({
  visible,
  onClose,
  code,
}) => {
  const handleCopyCode = async () => {
    if (code) {
      await Clipboard.setStringAsync(code);
      Alert.alert("Copiado", "El código ha sido copiado al portapapeles");
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="m-5 bg-white rounded-2xl p-8 items-center shadow-lg w-11/12 max-w-sm">
          <TouchableOpacity className="absolute right-2 top-2" onPress={onClose}>
            <Ionicons name="close-circle" size={32} color="#666" />
          </TouchableOpacity>

          <View className="mb-5">
            <Ionicons name="people-circle" size={80} color="#10b981" />
          </View>

          <Text className="text-2xl font-bold mb-4 text-center text-gray-800">
            Agregar Cuidador
          </Text>

          <Text className="text-base text-center mb-5 text-gray-600">
            Comparte este código con tu cuidador para que pueda conectarse contigo
          </Text>

          {code && (
            <>
              <View className="w-full bg-gray-100 rounded-lg py-5 px-4 mb-5">
                <Text className="text-4xl font-bold tracking-widest text-green-500 text-center">
                  {code}
                </Text>
              </View>

              <TouchableOpacity
                className="w-full flex-row items-center justify-center border-2 border-green-500 rounded-lg py-2 px-5 mb-5"
                onPress={handleCopyCode}
              >
                <Ionicons name="copy-outline" size={20} color="#10b981" />
                <Text className="text-green-500 text-base font-semibold ml-2">Copiar Código</Text>
              </TouchableOpacity>
            </>
          )}

          <Text className="text-sm text-gray-400 italic mb-5">Este código expira en 24 horas</Text>

          <View className="flex-row gap-3 w-full">
            <TouchableOpacity
              className="flex-1 border-2 border-gray-300 rounded-lg py-3 px-4"
              onPress={onClose}
            >
              <Text className="text-gray-700 text-base font-semibold text-center">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-green-500 rounded-lg py-3 px-4"
              onPress={onClose}
            >
              <Text className="text-white text-base font-semibold text-center">Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
