import { Text, View } from "react-native";

export default function Notifications() {
  return (
    <View className="flex-1 p-5 bg-gray-100 justify-center items-center">
      <Text className="text-3xl font-bold mb-4 text-gray-800">Notifications</Text>
      <Text className="text-base text-gray-600 text-center">
        Your alerts and notifications will appear here.
      </Text>
    </View>
  );
}