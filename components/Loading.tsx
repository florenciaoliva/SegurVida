import { ActivityIndicator, View } from "react-native";

export default function Loading() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}