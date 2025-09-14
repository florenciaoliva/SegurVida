import Loading from "@/components/Loading";
import { StackLayout } from "@/components/StackLayout";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from "convex/react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import "../global.css";
import Auth from "./auth";

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
        <Loading />
      </AuthLoading>

      <Unauthenticated>
        <Auth />
      </Unauthenticated>

      <Authenticated>
        <StackLayout />
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
