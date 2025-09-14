import { View, Text, SafeAreaView } from "react-native";

export default function CaregiverAlerts() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-green-600 mb-4">
          Alertas Activas
        </Text>
        <Text className="text-gray-600 text-center px-6">
          Emergencias y alertas de los pacientes asignados -
          con prioridad y acciones disponibles
        </Text>
      </View>
    </SafeAreaView>
  );
}