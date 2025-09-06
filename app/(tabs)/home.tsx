import { EmergencyButton } from "@/features/emergency/emergency-button";
import { useAuthActions } from "@convex-dev/auth/react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const { signOut } = useAuthActions();

  const handleSignOut = async () => {
    try {
      await signOut();
      // After sign out, the auth state will change and redirect to sign-in automatically
    } catch (error) {
      Alert.alert("Error", "Failed to sign out. Please try again.");
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
        className="bg-red-500 px-8 py-4 rounded-lg self-center"
        onPress={handleSignOut}
      >
        <Text className="text-white text-base font-semibold">Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
