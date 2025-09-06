import { SignInWithPassword } from "@/features/auth/signin-with-password";
import { SafeAreaView, View } from "react-native";

export default function SignIn() {
  const handleSent = (email: string) => {
    console.log(`Authentication initiated for: ${email}`);
  };

  const handlePasswordReset = () => {
    console.log("Password reset requested");
    // Add your password reset logic here
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center">
        <SignInWithPassword
          handleSent={handleSent}
          handlePasswordReset={handlePasswordReset}
          passwordRequirements={{
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumber: true,
            requireSpecialChar: false,
          }}
        />
      </View>
    </SafeAreaView>
  );
}
