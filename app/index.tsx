import { useAuthActions } from "@convex-dev/auth/react";
import { Text, View, TouchableOpacity, Alert } from "react-native";

export default function Index() {
  const { signOut } = useAuthActions();

  const handleSignOut = async () => {
    try {
      await signOut();
      // After sign out, the auth state will change and redirect to sign-in automatically
    } catch (error) {
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <Text className="text-3xl font-bold mt-16 mb-2 text-gray-800 text-center">
        Welcome to SegurVida
      </Text>
      <Text className="text-lg text-green-500 mb-10 text-center font-semibold">
        You are successfully logged in!
      </Text>
      
      <View className="flex-1 justify-center items-center px-5">
        <Text className="text-base text-gray-600 text-center leading-6">
          This is your protected home screen. Only authenticated users can see this.
        </Text>
      </View>

      <TouchableOpacity 
        className="bg-red-500 px-8 py-4 rounded-lg self-center mb-10"
        onPress={handleSignOut}
      >
        <Text className="text-white text-base font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}