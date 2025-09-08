import { cn } from "@/lib/utils";
import { ScrollView, Text, View } from "react-native";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  subtitle?: string;
  state: "delivered" | "failed" | "in_progress" | "awaiting_delivery";
  priority: "high" | "normal" | "default";
  interruptionLevel?: "critical" | "active" | "passive" | "time-sensitive";
  timestamp: string;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Alerta de Emergencia Enviada",
    body: "Tu alerta de emergencia ha sido enviada exitosamente a Juan García",
    subtitle: "Contacto: Padre",
    state: "delivered",
    priority: "high",
    interruptionLevel: "critical",
    timestamp: "Hace 5 minutos",
  },
  // {
  //   id: "2",
  //   title: "Ubicación Compartida",
  //   body: "Tu ubicación actual ha sido compartida con tu contacto de emergencia",
  //   state: "delivered",
  //   priority: "high",
  //   interruptionLevel: "time-sensitive",
  //   timestamp: "Hace 10 minutos",
  // },
  // {
  //   id: "3",
  //   title: "Contacto Actualizado",
  //   body: "María García ha sido configurada como tu nuevo contacto de emergencia",
  //   subtitle: "Contacto: Madre",
  //   state: "delivered",
  //   priority: "normal",
  //   interruptionLevel: "active",
  //   timestamp: "Hace 2 horas",
  // },
  // {
  //   id: "4",
  //   title: "Prueba de Sistema",
  //   body: "Prueba mensual del sistema de emergencias completada",
  //   state: "delivered",
  //   priority: "default",
  //   interruptionLevel: "passive",
  //   timestamp: "Ayer",
  // },
  // {
  //   id: "5",
  //   title: "Error de Envío",
  //   body: "No se pudo enviar la alerta. Por favor verifica tu conexión",
  //   state: "failed",
  //   priority: "high",
  //   interruptionLevel: "critical",
  //   timestamp: "Hace 2 días",
  // },
];

function getStateColor(state: NotificationItem["state"]) {
  switch (state) {
    case "delivered":
      return "text-green-600";
    case "failed":
      return "text-red-600";
    case "in_progress":
      return "text-blue-600";
    case "awaiting_delivery":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
}

function getStateText(state: NotificationItem["state"]) {
  switch (state) {
    case "delivered":
      return "Entregado";
    case "failed":
      return "Fallido";
    case "in_progress":
      return "En progreso";
    case "awaiting_delivery":
      return "Pendiente";
    default:
      return state;
  }
}

function getPriorityStyle(
  priority: NotificationItem["priority"],
  interruptionLevel?: NotificationItem["interruptionLevel"]
) {
  if (interruptionLevel === "critical" || priority === "high") {
    return "border-l-4 border-l-red-500";
  }
  if (interruptionLevel === "time-sensitive") {
    return "border-l-4 border-l-orange-500";
  }
  if (priority === "normal" || interruptionLevel === "active") {
    return "border-l-4 border-l-blue-500";
  }
  return "border-l-4 border-l-gray-300";
}

function NotificationCard({ notification }: { notification: NotificationItem }) {
  return (
    <View
      className={cn(
        "bg-white rounded-lg p-4 mb-3 shadow-sm",
        getPriorityStyle(notification.priority, notification.interruptionLevel)
      )}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-800">{notification.title}</Text>
          {notification.subtitle && (
            <Text className="text-sm text-gray-600 mt-0.5">{notification.subtitle}</Text>
          )}
        </View>
        <View className="items-end">
          <Text className={cn("text-xs font-medium", getStateColor(notification.state))}>
            {getStateText(notification.state)}
          </Text>
        </View>
      </View>

      <Text className="text-sm text-gray-700 mb-2">{notification.body}</Text>

      <View className="flex-row justify-between items-center">
        <Text className="text-xs text-gray-500">{notification.timestamp}</Text>
        {notification.interruptionLevel === "critical" && (
          <View className="bg-red-100 px-2 py-0.5 rounded">
            <Text className="text-xs text-red-800 font-medium">Crítico</Text>
          </View>
        )}
        {notification.interruptionLevel === "time-sensitive" && (
          <View className="bg-orange-100 px-2 py-0.5 rounded">
            <Text className="text-xs text-orange-800 font-medium">Urgente</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function Notifications() {
  const hasNotifications = MOCK_NOTIFICATIONS.length > 0;

  return (
    <View className="flex-1 bg-gray-100">
      <View className="p-5 pb-2">
        <Text className="text-3xl font-bold mt-16 mb-2 text-gray-800 text-center">
          Notificaciones
        </Text>
        <Text className="text-lg text-gray-600 mb-4 text-center">
          Historial de alertas y notificaciones
        </Text>
      </View>

      {hasNotifications ? (
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
          <View className="pb-5">
            {MOCK_NOTIFICATIONS.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-6xl mb-4">📭</Text>
          <Text className="text-lg font-semibold text-gray-800 mb-2">No hay notificaciones</Text>
          <Text className="text-sm text-gray-600 text-center">
            Las alertas de emergencia y otras notificaciones aparecerán aquí
          </Text>
        </View>
      )}
    </View>
  );
}
