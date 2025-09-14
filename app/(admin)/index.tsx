import { View, Text, SafeAreaView } from "react-native";

export default function AdminAnalytics() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-red-600 mb-4">
          Reportes y Analytics
        </Text>
        <Text className="text-gray-600 text-center px-6">
          Métricas del sistema, reportes de emergencias,
          estadísticas de uso y análisis de rendimiento
        </Text>
      </View>
    </SafeAreaView>
  );
}