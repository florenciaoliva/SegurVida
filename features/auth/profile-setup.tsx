import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ProfileSetupProps {
  onComplete: () => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const updateProfile = useMutation(api.users.updateProfile);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"name" | "phone">("name");

  const handleSubmitName = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Por favor ingresa tu nombre");
      return;
    }

    setSubmitting(true);
    try {
      await updateProfile({ name: name.trim() });
      // For now, skip phone step and complete
      onComplete();
      // In the future, uncomment this to go to phone step:
      // setStep("phone");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar tu perfil");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitPhone = async () => {
    if (!phone.trim()) {
      // Allow skipping phone for now
      onComplete();
      return;
    }

    setSubmitting(true);
    try {
      await updateProfile({ phone: phone.trim() });
      onComplete();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar tu perfil");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (step === "name") {
      // Name is required, can't skip
      Alert.alert("Información requerida", "Por favor ingresa tu nombre para continuar");
    } else {
      // Phone can be skipped for now
      onComplete();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View className="p-5 justify-center">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
              {step === "name" ? "¿Cómo te llamas?" : "Tu número de teléfono"}
            </Text>
            <Text className="text-base text-gray-600 text-center">
              {step === "name"
                ? "Necesitamos tu nombre para personalizar tu experiencia"
                : "Opcional: Tu número de teléfono para notificaciones"}
            </Text>
          </View>

          {step === "name" ? (
            <>
              <Text className="text-base font-medium mb-2 text-gray-800">Nombre completo</Text>
              <TextInput
                className={cn(
                  "border-2 rounded-lg px-3 py-4 text-base mb-4 bg-white text-gray-800 leading-tight",
                  "border-gray-300 focus:border-blue-500"
                )}
                value={name}
                onChangeText={setName}
                placeholder="Ingresa tu nombre completo"
                placeholderTextColor="#999"
                autoCapitalize="words"
                autoComplete="name"
                editable={!submitting}
              />
            </>
          ) : (
            <>
              <Text className="text-base font-medium mb-2 text-gray-800">Número de teléfono</Text>
              <TextInput
                className={cn(
                  "border-2 rounded-lg px-3 py-4 text-base mb-4 bg-white text-gray-800 leading-tight",
                  "border-gray-300 focus:border-blue-500"
                )}
                value={phone}
                onChangeText={setPhone}
                placeholder="+54 11 1234-5678"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                autoComplete="tel"
                editable={!submitting}
              />
              
              <Text className="text-xs text-gray-500 -mt-2 mb-4">
                Usaremos tu número solo para notificaciones de emergencia
              </Text>
            </>
          )}

          <TouchableOpacity
            className={cn(
              "rounded-lg p-4 items-center mb-3",
              submitting ? "bg-gray-300 opacity-70" : "bg-blue-500"
            )}
            onPress={step === "name" ? handleSubmitName : handleSubmitPhone}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-semibold text-white">
                {step === "name" ? "Continuar" : "Finalizar"}
              </Text>
            )}
          </TouchableOpacity>

          {step === "phone" && (
            <TouchableOpacity
              onPress={handleSkip}
              disabled={submitting}
              className="p-2"
            >
              <Text className="text-blue-500 text-sm text-center">
                Omitir por ahora
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}