import { useAuthActions } from "@convex-dev/auth/react";
import { Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";

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
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SegurVida</Text>
      <Text style={styles.subtitle}>You are successfully logged in!</Text>
      
      <View style={styles.content}>
        <Text style={styles.infoText}>
          This is your protected home screen. Only authenticated users can see this.
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#4CAF50",
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  signOutButton: {
    backgroundColor: "#FF5252",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 40,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});