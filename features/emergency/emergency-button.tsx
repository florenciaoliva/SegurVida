import { cn } from "@/lib/utils";
import { Text, TouchableOpacity } from "react-native";

export function EmergencyButton({ className }: { className?: string }) {
  return (
    <TouchableOpacity
      className={cn(
        "bg-red-500 px-8 py-4 items-center self-center h-60 w-60 rounded-full border-2 border-white shadow-lg justify-center",
        className
      )}
    >
      <Text className="text-white text-2xl font-semibold w-full text-center justify-center items-center ">
        EMERGENCIA
      </Text>
    </TouchableOpacity>
  );
}