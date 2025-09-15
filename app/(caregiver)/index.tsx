import { api } from "@/convex/_generated/api";
import { EnterCodeModal } from "@/features/caregiver/EnterCodeModal";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function CaregiverAlerts() {
  const [modalVisible, setModalVisible] = useState(false);
  const user = useQuery(api.users.viewer);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 p-5">
        <Text className="text-3xl font-bold text-gray-800 text-center mt-10 mb-4">
          Panel de Cuidador
        </Text>

        {user?.associatedUser ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-2xl font-bold text-green-600 mb-4">Alertas Activas</Text>
            <Text className="text-gray-600 text-center px-6">
              Emergencias y alertas de los pacientes asignados - con prioridad y acciones
              disponibles
            </Text>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center">
            <View className="mb-8 items-center">
              <Ionicons name="people-outline" size={100} color="#9ca3af" />
              <Text className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                No estás conectado con ningún usuario
              </Text>
              <Text className="text-gray-500 text-center px-8">
                Conecta con un usuario para recibir sus alertas de emergencia
              </Text>
            </View>

            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-lg flex-row items-center"
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="link" size={20} color="white" style={{ marginRight: 8 }} />
              <Text className="text-white text-base font-semibold">Conectar con Usuario</Text>
            </TouchableOpacity>
          </View>
        )}

        {user?.associatedUser && (
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-lg self-center flex-row items-center mb-4"
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="person-add" size={20} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white text-base font-semibold">Cambiar Usuario</Text>
          </TouchableOpacity>
        )}

        <EnterCodeModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      </View>
    </SafeAreaView>
  );
}
