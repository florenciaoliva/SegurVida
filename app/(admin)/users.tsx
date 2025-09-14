import { View, Text, SafeAreaView } from "react-native";

export default function AdminUsers() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-red-600 mb-4">
          Gestión de Usuarios
        </Text>
        <Text className="text-gray-600 text-center px-6">
          Panel de administración de usuarios - crear, editar, eliminar usuarios,
          asignar roles y gestionar permisos
        </Text>
      </View>
    </SafeAreaView>
  );
}