import { Text, View } from "react-native";

export default function Profile() {
  return (
    <View className="flex-1 p-5 bg-gray-100 justify-center items-center">
      <Text className="text-3xl font-bold mb-4 text-gray-800">Profile</Text>
      <Text className="text-base text-gray-600 text-center">
        Your profile settings and information will be displayed here.
      </Text>
    </View>
  );
}