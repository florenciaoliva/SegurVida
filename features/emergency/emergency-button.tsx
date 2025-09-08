import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { useCallback } from "react";
import { Alert, Text, TouchableOpacity } from "react-native";

export function EmergencyButton({ className }: { className?: string }) {
  const user = useQuery(api.users.viewer);
  const currentActiveEmergency = useQuery(api.emergencies.getCurrentActiveEmergency);
  const createEmergencyWorkflow = useMutation(api.emergencies.createEmergencyWorkflow);

  const handleEmergency = useCallback(() => {
    // TODO: add modal to confirm a new emergency or mark the current emergency as solved
    if (currentActiveEmergency) {
      Alert.alert("Emergency", "You already have an active emergency");
      return;
    }
    // TODO: get location from the user's device
    createEmergencyWorkflow({
      description: `Emergency, ${user?.name || "Unknown"}, needs help!`,
    })
      .then(() => {
        Alert.alert("Emergency", "Emergency created successfully");
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to create emergency", error);
        console.error(error);
      });
  }, []);

  return (
    <TouchableOpacity
      className={cn(
        "bg-red-500 px-8 py-4 items-center self-center h-60 w-60 rounded-full border-2 border-white shadow-lg justify-center",
        className
      )}
      onPress={handleEmergency}
    >
      <Text className="text-white text-2xl font-semibold w-full text-center justify-center items-center ">
        EMERGENCIA
      </Text>
    </TouchableOpacity>
  );
}
