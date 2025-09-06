import { View, StyleSheet, SafeAreaView } from "react-native";
import { SignInWithPassword } from "./features/auth/signin-with-password";

export default function SignIn() {
  const handleSent = (email: string) => {
    console.log(`Authentication initiated for: ${email}`);
  };

  const handlePasswordReset = () => {
    console.log("Password reset requested");
    // Add your password reset logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
});