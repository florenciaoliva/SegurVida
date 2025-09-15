import { EmergencyButton } from "@/features/emergency/emergency-button";
import { ConnectionCodeModal } from "@/features/caregiver/ConnectionCodeModal";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const { signOut } = useAuthActions();
  const [modalVisible, setModalVisible] = useState(false);
  const [connectionCode, setConnectionCode] = useState<string | null>(null);
  const generateCode = useMutation(api.connectionCodes.generateCode);

  const handleSignOut = async () => {
    try {
      await signOut();
      // After sign out, the auth state will change and redirect to sign-in automatically
    } catch (error) {
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  const handleAddCaregiver = async () => {
    try {
      const result = await generateCode();
      setConnectionCode(result.code);
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Error", "No se pudo generar el código. Intenta de nuevo.");
    }
  };

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <Text className="text-3xl font-bold mt-16 mb-2 text-gray-800 text-center">
        Bienvenido a SegurVida
      </Text>
      <Text className="text-lg text-green-500 mb-10 text-center font-semibold">
        Ya estás logueado!
      </Text>

      <View className="flex-1 justify-center">
        <EmergencyButton />
      </View>

      <TouchableOpacity
        className="bg-blue-500 px-6 py-3 rounded-lg self-center mb-4 flex-row items-center"
        onPress={handleAddCaregiver}
      >
        <Ionicons name="person-add" size={20} color="white" style={{ marginRight: 8 }} />
        <Text className="text-white text-base font-semibold">Agregar Nuevo Cuidador</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-red-500 px-8 py-4 rounded-lg self-center"
        onPress={handleSignOut}
      >
        <Text className="text-white text-base font-semibold">Cerrar sesión</Text>
      </TouchableOpacity>

      <ConnectionCodeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        code={connectionCode}
      />
    </View>
  );
}
