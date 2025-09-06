import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from "convex/react";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, Platform, View } from "react-native";
import "../global.css";
import SignIn from "./sign-in";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

function RootLayoutNav() {
  return (
    <>
      <AuthLoading>
        <View className="flex-1 justify-center items-center bg-gray-100">
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </AuthLoading>

      <Unauthenticated>
        <SignIn />
      </Unauthenticated>

      <Authenticated>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="index"
            options={{
              title: "Home",
              headerShown: true,
            }}
          />
        </Stack>
      </Authenticated>
    </>
  );
}

export default function RootLayout() {
  return (
    <ConvexAuthProvider
      client={convex}
      storage={Platform.OS === "android" || Platform.OS === "ios" ? secureStorage : undefined}
    >
      <RootLayoutNav />
    </ConvexAuthProvider>
  );
}
