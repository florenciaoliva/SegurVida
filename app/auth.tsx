import { SignInForm } from "@/features/auth/signin-form";
import { SignUpForm } from "@/features/auth/signup-form";
import { useState } from "react";
import { Image, SafeAreaView, View } from "react-native";

type AuthWorkflow = "signIn" | "signUp";

export default function Auth() {
  const [workflow, setWorkflow] = useState<AuthWorkflow>("signIn");

  const handleSwitchToSignUp = () => {
    setWorkflow("signUp");
  };

  const handleSwitchToSignIn = () => {
    setWorkflow("signIn");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        {/* Background Image */}
        <Image
          source={require("@/assets/images/splash-icon.png")}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.1 }}
          resizeMode="center"
        />
        
        {/* Content */}
        <View className="flex-1 justify-center">
          {workflow === "signUp" ? (
            <SignUpForm onSwitchToSignIn={handleSwitchToSignIn} />
          ) : (
            <SignInForm onSwitchToSignUp={handleSwitchToSignUp} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
