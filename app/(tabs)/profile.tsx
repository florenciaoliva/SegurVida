import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const currentUser = useQuery(api.users.viewer);
  const availableCaregivers = useQuery(api.users.getAvailableCaregivers);
  const myCaregivers = useQuery(api.users.getMyCaregiversList);
  const updateMyCaregiversList = useMutation(api.users.updateMyCaregiversList);

  const [selectedCaregivers, setSelectedCaregivers] = useState<Id<"users">[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize selected caregivers when data loads
  if (myCaregivers && !hasInitialized) {
    setSelectedCaregivers(myCaregivers.map((c) => c._id));
    setHasInitialized(true);
  }

  const toggleCaregiver = (caregiverId: Id<"users">) => {
    setSelectedCaregivers((prev) =>
      prev.includes(caregiverId)
        ? prev.filter((id) => id !== caregiverId)
        : [...prev, caregiverId]
    );
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await updateMyCaregiversList({ caregiverIds: selectedCaregivers });
      Alert.alert(
        "Éxito",
        "Los contactos de emergencia han sido actualizados correctamente"
      );
    } catch (error) {
      Alert.alert("Error", "No se pudieron actualizar los contactos de emergencia");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (!currentUser || !availableCaregivers) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Cargando perfil...</Text>
      </View>
    );
  }

  // Only users can select caregivers
  if (currentUser.role !== "user") {
    return (
      <View className="flex-1 p-5 bg-gray-100">
        <Text className="text-3xl font-bold mt-16 mb-2 text-gray-800 text-center">
          Perfil
        </Text>
        <Text className="text-lg text-gray-600 mb-4 text-center">
          {currentUser.role === "caregiver" ? "Cuenta de Cuidador" : "Cuenta de Administrador"}
        </Text>
        
        <View className="bg-white rounded-lg p-4 mt-4">
          <Text className="text-base font-medium text-gray-800 mb-2">
            Información de la cuenta
          </Text>
          <Text className="text-sm text-gray-600">Email: {currentUser.email}</Text>
          <Text className="text-sm text-gray-600">
            Rol: {currentUser.role === "caregiver" ? "Cuidador" : "Administrador"}
          </Text>
        </View>

        {currentUser.role === "caregiver" && (
          <View className="bg-blue-50 p-4 rounded-lg mt-4">
            <Text className="text-sm text-blue-800">
              ℹ️ Como cuidador, recibirás notificaciones de emergencia de los usuarios que te hayan seleccionado.
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-5">
          <Text className="text-3xl font-bold mt-16 mb-2 text-gray-800 text-center">
            Perfil
          </Text>
          <Text className="text-lg text-gray-600 mb-6 text-center">
            Configura tus contactos de emergencia
          </Text>

          {/* User Info */}
          <View className="bg-white rounded-lg p-4 mb-6">
            <Text className="text-base font-medium text-gray-800 mb-2">
              Tu información
            </Text>
            <Text className="text-sm text-gray-600">Email: {currentUser.email}</Text>
            <Text className="text-sm text-gray-600">
              Nombre: {currentUser.name || "No especificado"}
            </Text>
          </View>

          {/* Caregiver Selection */}
          <View className="mb-6">
            <Text className="text-base font-medium mb-3 text-gray-800">
              Selecciona tus contactos de emergencia
            </Text>
            <Text className="text-sm text-gray-600 mb-4">
              Estos contactos recibirán una notificación cuando presiones el botón de emergencia
            </Text>

            {availableCaregivers.length === 0 ? (
              <View className="bg-gray-50 rounded-lg p-4">
                <Text className="text-sm text-gray-600 text-center">
                  No hay cuidadores disponibles en el sistema
                </Text>
              </View>
            ) : (
              <View className="space-y-2 gap-2">
                {availableCaregivers.map((caregiver) => {
                  const isSelected = selectedCaregivers.includes(caregiver._id);
                  return (
                    <TouchableOpacity
                      key={caregiver._id}
                      className={cn(
                        "border-2 rounded-lg p-3 bg-white",
                        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-300"
                      )}
                      onPress={() => toggleCaregiver(caregiver._id)}
                    >
                      <View className="flex-row items-center">
                        <View className="mr-3">
                          <View
                            className={cn(
                              "w-5 h-5 rounded border-2",
                              isSelected
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-400 bg-white"
                            )}
                          >
                            {isSelected && (
                              <View className="flex-1 items-center justify-center">
                                <Text className="text-white text-xs font-bold">✓</Text>
                              </View>
                            )}
                          </View>
                        </View>
                        <View className="flex-1">
                          <Text
                            className={cn(
                              "text-base font-medium",
                              isSelected ? "text-blue-600" : "text-gray-800"
                            )}
                          >
                            {caregiver.name || caregiver.email}
                          </Text>
                          <Text
                            className={cn(
                              "text-xs",
                              isSelected ? "text-blue-500" : "text-gray-600"
                            )}
                          >
                            {caregiver.email}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Info box */}
          <View className="bg-blue-50 p-4 rounded-lg mb-6">
            <Text className="text-sm text-blue-800">
              ℹ️ Tienes {selectedCaregivers.length} contacto(s) de emergencia seleccionado(s).
              {selectedCaregivers.length === 0 &&
                " Es importante tener al menos un contacto configurado."}
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className={cn(
              "rounded-lg p-4 items-center",
              isLoading ? "bg-gray-300" : "bg-blue-500"
            )}
            onPress={handleSaveChanges}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-semibold">Guardar cambios</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}