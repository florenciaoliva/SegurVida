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

type UserRole = "user" | "caregiver" | "admin";
type SignUpStep = "credentials" | "profile";

interface PasswordRequirements {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecialChar?: boolean;
}

const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: false,
};

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
}

function UserTypeSelector({
  selectedRole,
  onSelectRole,
}: {
  selectedRole: UserRole;
  onSelectRole: (type: UserRole) => void;
}) {
  const types: { value: UserRole; label: string; description: string }[] = [
    {
      value: "user",
      label: "Usuario",
      description: "Persona que necesita asistencia de emergencia",
    },
    {
      value: "caregiver",
      label: "Cuidador",
      description: "Familiar o profesional que cuida a otros",
    },
    {
      value: "admin",
      label: "Administrador",
      description: "Gestiona el sistema y usuarios",
    },
  ];

  return (
    <View className="mb-4">
      <Text className="text-base font-medium mb-2 text-gray-800">Tipo de Usuario</Text>
      <View className="space-y-2 gap-2">
        {types.map((type) => (
          <TouchableOpacity
            key={type.value}
            className={cn(
              "border-2 rounded-lg p-3 bg-white",
              selectedRole === type.value ? "border-blue-500 bg-blue-50" : "border-gray-300"
            )}
            onPress={() => onSelectRole(type.value)}
          >
            <View className="flex-row items-center">
              <View className="mr-3">
                <View
                  className={cn(
                    "w-5 h-5 rounded-full border-2",
                    selectedRole === type.value
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-400 bg-white"
                  )}
                >
                  {selectedRole === type.value && (
                    <View className="flex-1 items-center justify-center">
                      <Text className="text-white text-xs font-bold">✓</Text>
                    </View>
                  )}
                </View>
              </View>
              <View className="flex-1">
                <Text
                  className={cn(
                    "text-base font-medium",
                    selectedRole === type.value ? "text-blue-600" : "text-gray-800"
                  )}
                >
                  {type.label}
                </Text>
                <Text
                  className={cn(
                    "text-xs",
                    selectedRole === type.value ? "text-blue-500" : "text-gray-600"
                  )}
                >
                  {type.description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function RequirementItem({ met, text, touched }: { met: boolean; text: string; touched: boolean }) {
  return (
    <View className="flex-row items-center mb-1.5">
      <Text
        className={cn("text-sm mr-2 w-4 text-center", {
          "text-green-500 font-bold": met,
          "text-red-500": touched && !met,
          "text-gray-400": !met && !touched,
        })}
      >
        {met ? "✓" : "○"}
      </Text>
      <Text
        className={cn("text-xs", {
          "text-green-500": met,
          "text-red-500": touched && !met,
          "text-gray-600": !met && !touched,
        })}
      >
        {text}
      </Text>
    </View>
  );
}

export function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<SignUpStep>("credentials");
  const [submitting, setSubmitting] = useState(false);

  // Credentials step state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Profile step state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Parse password requirements
  const requirements = useMemo(() => {
    return DEFAULT_PASSWORD_REQUIREMENTS;
  }, []);

  // Email validation
  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, [email]);

  // Password validation
  const passwordValidation = useMemo(() => {
    const checks = {
      minLength: password.length >= (requirements.minLength || 8),
      hasUppercase: !requirements.requireUppercase || /[A-Z]/.test(password),
      hasLowercase: !requirements.requireLowercase || /[a-z]/.test(password),
      hasNumber: !requirements.requireNumber || /\d/.test(password),
      hasSpecialChar: !requirements.requireSpecialChar || /[!@#$%^&*(),.?\":{}|<>]/.test(password),
    };

    const isValid = Object.values(checks).every((check) => check);

    return { checks, isValid };
  }, [password, requirements]);

  // Check if current step is valid
  const isStepValid = useMemo(() => {
    if (step === "credentials") {
      return isEmailValid && passwordValidation.isValid;
    }
    // Profile step - name is required
    return name.trim().length > 0;
  }, [step, isEmailValid, passwordValidation.isValid, name]);

  const handleNextStep = () => {
    if (!isStepValid) {
      Alert.alert("Error de validación", "Por favor completa todos los campos requeridos");
      return;
    }
    setStep("profile");
  };

  const handleSignUp = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Por favor ingresa tu nombre");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("flow", "signUp");
    formData.append("role", userRole);
    formData.append("name", name.trim());
    if (phone.trim()) {
      formData.append("phone", phone.trim());
    }

    try {
      await signIn("password", formData);
      // Auth state will handle navigation
    } catch (error) {
      console.error(error);
      let alertTitle: string;
      if (error instanceof ConvexError && error.data === INVALID_PASSWORD) {
        alertTitle = "Contraseña inválida - verifica los requisitos e intenta de nuevo.";
      } else {
        alertTitle = "No se pudo crear la cuenta. ¿Quizás ya tienes una cuenta?";
      }
      Alert.alert("Error", alertTitle);
      setSubmitting(false);
    }
  };

  const renderPasswordRequirements = () => {
    return (
      <View className="-mt-2 mb-4">
        <RequirementItem
          met={passwordValidation.checks.minLength}
          text={`Al menos ${requirements.minLength} caracteres`}
          touched={passwordTouched}
        />
        <RequirementItem
          met={passwordValidation.checks.hasUppercase}
          text="Una letra mayúscula"
          touched={passwordTouched}
        />
        <RequirementItem
          met={passwordValidation.checks.hasLowercase}
          text="Una letra minúscula"
          touched={passwordTouched}
        />
        <RequirementItem
          met={passwordValidation.checks.hasNumber}
          text="Un número"
          touched={passwordTouched}
        />
      </View>
    );
  };

  const renderCredentialsStep = () => (
    <>
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-800 text-center mb-2">Crear Cuenta</Text>
        <Text className="text-base text-gray-600 text-center">
          Únete a SegurVida para estar protegido
        </Text>
        <View className="flex-row justify-center mt-4">
          <View className="w-2 h-2 rounded-full bg-blue-500 mx-1" />
          <View className="w-2 h-2 rounded-full bg-gray-300 mx-1" />
        </View>
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

      <Text className="text-base font-medium mb-2 text-gray-800">Contraseña</Text>
      <TextInput
        className={cn(
          "border-2 rounded-lg px-3 py-4 text-base mb-4 bg-white text-gray-800 leading-tight",
          passwordTouched && !passwordValidation.isValid && "border-red-500",
          passwordTouched && passwordValidation.isValid && "border-green-500",
          !passwordTouched && "border-gray-300"
        )}
        value={password}
        onChangeText={setPassword}
        onBlur={() => setPasswordTouched(true)}
        placeholder="Crea una contraseña segura"
        placeholderTextColor="#999"
        secureTextEntry
        autoComplete="new-password"
        editable={!submitting}
      />

      {renderPasswordRequirements()}

      <UserTypeSelector selectedRole={userRole} onSelectRole={setUserRole} />

      <TouchableOpacity
        className={cn(
          "rounded-lg p-4 items-center mb-4",
          !isStepValid || submitting ? "bg-gray-300 opacity-70" : "bg-blue-500"
        )}
        onPress={handleNextStep}
        disabled={!isStepValid || submitting}
      >
        <Text className="text-base font-semibold text-white">Continuar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSwitchToSignIn} disabled={submitting}>
        <Text className="text-blue-500 text-sm text-center mt-2">
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderProfileStep = () => (
    <>
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
          Completa tu perfil
        </Text>
        <Text className="text-base text-gray-600 text-center">
          Necesitamos algunos datos más
        </Text>
        <View className="flex-row justify-center mt-4">
          <View className="w-2 h-2 rounded-full bg-gray-300 mx-1" />
          <View className="w-2 h-2 rounded-full bg-blue-500 mx-1" />
        </View>
      </View>

      <Text className="text-base font-medium mb-2 text-gray-800">Nombre completo</Text>
      <TextInput
        className="border-2 border-gray-300 rounded-lg px-3 py-4 text-base mb-4 bg-white text-gray-800 leading-tight focus:border-blue-500"
        value={name}
        onChangeText={setName}
        placeholder="Tu nombre completo"
        placeholderTextColor="#999"
        autoCapitalize="words"
        autoComplete="name"
        editable={!submitting}
      />

      <Text className="text-base font-medium mb-2 text-gray-800">
        Teléfono (opcional)
      </Text>
      <TextInput
        className="border-2 border-gray-300 rounded-lg px-3 py-4 text-base mb-2 bg-white text-gray-800 leading-tight focus:border-blue-500"
        value={phone}
        onChangeText={setPhone}
        placeholder="+54 11 1234-5678"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        autoComplete="tel"
        editable={!submitting}
      />
      <Text className="text-xs text-gray-500 mb-6">
        Lo usaremos solo para notificaciones de emergencia
      </Text>

      <View className="flex-row gap-3">
        <TouchableOpacity
          className="flex-1 border-2 border-gray-300 rounded-lg p-4 items-center"
          onPress={() => setStep("credentials")}
          disabled={submitting}
        >
          <Text className="text-base font-semibold text-gray-700">Atrás</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={cn(
            "flex-1 rounded-lg p-4 items-center",
            !isStepValid || submitting ? "bg-gray-300 opacity-70" : "bg-blue-500"
          )}
          onPress={handleSignUp}
          disabled={!isStepValid || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-semibold text-white">Crear cuenta</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

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
          {step === "credentials" ? renderCredentialsStep() : renderProfileStep()}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}