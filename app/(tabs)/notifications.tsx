import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

function getStatusColor(status: "pending" | "in_progress" | "solved") {
  switch (status) {
    case "solved":
      return "text-green-600";
    case "in_progress":
      return "text-blue-600";
    case "pending":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
}

function getStatusText(status: "pending" | "in_progress" | "solved") {
  switch (status) {
    case "solved":
      return "Resuelto";
    case "in_progress":
      return "En progreso";
    case "pending":
      return "Pendiente";
    default:
      return status;
  }
}

function getPriorityStyle(status: "pending" | "in_progress" | "solved") {
  switch (status) {
    case "pending":
      return "border-l-4 border-l-red-500";
    case "in_progress":
      return "border-l-4 border-l-orange-500";
    case "solved":
      return "border-l-4 border-l-green-500";
    default:
      return "border-l-4 border-l-gray-300";
  }
}

function formatTimestamp(timestamp: number) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Ahora mismo";
  if (minutes < 60) return `Hace ${minutes} minuto${minutes !== 1 ? "s" : ""}`;
  if (hours < 24) return `Hace ${hours} hora${hours !== 1 ? "s" : ""}`;
  if (days < 7) return `Hace ${days} día${days !== 1 ? "s" : ""}`;

  const date = new Date(timestamp);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

function EmergencyCard({ emergency, userRole }: { emergency: any; userRole: string }) {
  return (
    <View
      className={cn("bg-white rounded-lg p-4 mb-3 shadow-sm", getPriorityStyle(emergency.status))}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-800">
            {userRole === "caregiver" ? "Alerta de Emergencia Recibida" : "Emergencia Enviada"}
          </Text>
        </View>
        <View className="items-end">
          <Text className={cn("text-xs font-medium", getStatusColor(emergency.status))}>
            {getStatusText(emergency.status)}
          </Text>
        </View>
      </View>

      <Text className="text-sm text-gray-700 mb-2">
        {emergency.description || "Emergencia sin descripción"}
      </Text>

      {emergency.location && (
        <Text className="text-xs text-gray-500 mb-2">📍 Ubicación disponible</Text>
      )}

      <View className="flex-row justify-between items-center">
        <Text className="text-xs text-gray-500">{formatTimestamp(emergency._creationTime)}</Text>
        {emergency.status === "pending" && (
          <View className="bg-red-100 px-2 py-0.5 rounded">
            <Text className="text-xs text-red-800 font-medium">Urgente</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function Notifications() {
  const currentUser = useQuery(api.users.viewer);
  const emergencies = useQuery(api.emergencies.getMyEmergencies);

  // Show loading state
  if (!currentUser || emergencies === undefined) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Cargando notificaciones...</Text>
      </View>
    );
  }

  const hasEmergencies = emergencies && emergencies.length > 0;

  return (
    <View className="flex-1 bg-gray-100">
      <View className="p-5 pb-2">
        <Text className="text-3xl font-bold mt-16 mb-2 text-gray-800 text-center">
          Notificaciones
        </Text>
        <Text className="text-lg text-gray-600 mb-4 text-center">
          {currentUser.role === "caregiver"
            ? "Alertas de usuarios bajo tu cuidado"
            : "Historial de tus emergencias"}
        </Text>
      </View>

      {hasEmergencies ? (
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
          <View className="pb-5">
            {emergencies.map((emergency) => (
              <EmergencyCard
                key={emergency._id}
                emergency={emergency}
                userRole={currentUser.role}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center px-5 opacity-70">
          <Text className="text-lg font-semibold text-gray-800 mb-2">No hay notificaciones</Text>
          <Text className="text-sm text-gray-600 text-center">
            {currentUser.role === "caregiver"
              ? "Recibirás alertas cuando los usuarios bajo tu cuidado tengan emergencias"
              : "Las alertas de emergencia aparecerán aquí"}
          </Text>
        </View>
      )}
    </View>
  );
}
