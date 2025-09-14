import { View, Text, SafeAreaView } from "react-native";

export default function CaregiverProfile() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-green-600 mb-4">
          Perfil de Cuidador
        </Text>
        <Text className="text-gray-600 text-center px-6">
          Configuración personal del cuidador - certificaciones,
          disponibilidad y preferencias
        </Text>
      </View>
    </SafeAreaView>
  );
}