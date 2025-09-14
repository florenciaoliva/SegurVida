import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function CaregiverTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarActiveTintColor: "#059669", // Green theme for caregivers
        tabBarInactiveTintColor: "#6b7280",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Alertas",
          tabBarIcon: ({ color, size }) => <Ionicons name="warning" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="patients"
        options={{
          title: "Pacientes",
          tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
