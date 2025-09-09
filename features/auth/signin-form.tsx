import { INVALID_PASSWORD } from "@/convex/errors";
import { cn } from "@/lib/utils";
import { useAuthActions } from "@convex-dev/auth/react";
import { ConvexError } from "convex/values";
import { useMemo, useState } from "react";
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

interface SignInFormProps {
  onSwitchToSignUp: () => void;
}

export function SignInForm({ onSwitchToSignUp }: SignInFormProps) {
  const { signIn } = useAuthActions();
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  // Email validation
  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, [email]);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return email.length > 0 && password.length > 0 && isEmailValid;
  }, [email, password, isEmailValid]);

  const handleSubmit = () => {
    if (!isFormValid) {
      Alert.alert("Error de validación", "Por favor ingresa un email y contraseña válidos");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("flow", "signIn");

    signIn("password", formData)
      .then(() => {
        // Auth state will handle navigation
      })
      .catch((error) => {
        console.error(error);
        let alertTitle: string;
        if (error instanceof ConvexError && error.data === INVALID_PASSWORD) {
          alertTitle = "Contraseña incorrecta - verifica e intenta de nuevo.";
        } else {
          alertTitle = "No se pudo iniciar sesión. ¿Quizás necesitas crear una cuenta?";
        }
        Alert.alert("Error", alertTitle);
        setSubmitting(false);
      });
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
              Bienvenido de vuelta
            </Text>
            <Text className="text-base text-gray-600 text-center">
              Ingresa a tu cuenta de SegurVida
            </Text>
          </View>

          <Text className="text-base font-medium mb-2 text-gray-800">Email</Text>
          <TextInput
            className={cn(
              "border-2 rounded-lg px-3 py-4 text-base mb-4 bg-white text-gray-800 leading-tight",
              emailTouched && !isEmailValid && "border-red-500 mb-1",
              emailTouched && isEmailValid && "border-green-500",
              (!emailTouched || (!isEmailValid && !emailTouched)) && "border-gray-300"
            )}
            value={email}
            onChangeText={setEmail}
            onBlur={() => setEmailTouched(true)}
            placeholder="tu@email.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!submitting}
          />
          {emailTouched && !isEmailValid && (
            <Text className="text-red-500 text-xs mb-3 -mt-3">
              Por favor ingresa un email válido
            </Text>
          )}

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-medium text-gray-800">Contraseña</Text>
            {/* TODO: Implement password reset in the future: https://labs.convex.dev/auth/config/passwords#add-password-reset-form */}
            {/* <TouchableOpacity>
              <Text className="text-blue-500 text-sm">¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity> */}
          </View>

          <TextInput
            className="border-2 border-gray-300 rounded-lg px-3 py-4 text-base mb-6 bg-white text-gray-800 leading-tight"
            value={password}
            onChangeText={setPassword}
            placeholder="Tu contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            autoComplete="current-password"
            editable={!submitting}
          />

          <TouchableOpacity
            className={cn(
              "rounded-lg p-4 items-center mb-4",
              !isFormValid || submitting ? "bg-gray-300 opacity-70" : "bg-blue-500"
            )}
            onPress={handleSubmit}
            disabled={!isFormValid || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-semibold text-white">Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onSwitchToSignUp} disabled={submitting}>
            <Text className="text-blue-500 text-sm text-center mt-2">
              ¿No tienes cuenta? Regístrate
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
