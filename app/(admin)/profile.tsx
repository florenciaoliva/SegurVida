import { View, Text, SafeAreaView } from "react-native";

export default function AdminProfile() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-red-600 mb-4">
          Perfil de Administrador
        </Text>
        <Text className="text-gray-600 text-center px-6">
          Perfil personal del administrador - configuraciones
          de cuenta y preferencias del sistema
        </Text>
      </View>
    </SafeAreaView>
  );
}