import { View, Text, SafeAreaView } from "react-native";

export default function CaregiverPatients() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-green-600 mb-4">
          Mis Pacientes
        </Text>
        <Text className="text-gray-600 text-center px-6">
          Lista de pacientes asignados al cuidador -
          con estados, ubicaciones y datos de contacto
        </Text>
      </View>
    </SafeAreaView>
  );
}