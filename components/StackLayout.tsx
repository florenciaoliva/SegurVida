import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export function StackLayout() {
  const user = useQuery(api.users.viewer);

  // Don't render drawer until user data is loaded
  if (user === undefined) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="(user)"
          redirect={user?.role !== "user"}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="(caregiver)"
          redirect={user?.role !== "caregiver"}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="(admin)"
          redirect={user?.role !== "admin"}
          options={{ headerShown: false }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
