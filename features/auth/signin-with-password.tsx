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

export function SignInWithPassword({
  provider,
  handleSent,
  handlePasswordReset,
  customSignUp,
  passwordRequirements = DEFAULT_PASSWORD_REQUIREMENTS,
}: {
  provider?: string;
  handleSent?: (email: string) => void;
  handlePasswordReset?: () => void;
  customSignUp?: React.ReactNode;
  passwordRequirements?: PasswordRequirements | string;
}) {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Parse password requirements
  const requirements = useMemo(() => {
    if (typeof passwordRequirements === "string") {
      // If it's a string, just use default requirements
      return DEFAULT_PASSWORD_REQUIREMENTS;
    }
    return { ...DEFAULT_PASSWORD_REQUIREMENTS, ...passwordRequirements };
  }, [passwordRequirements]);

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
      hasSpecialChar: !requirements.requireSpecialChar || /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const isValid = Object.values(checks).every((check) => check);

    return { checks, isValid };
  }, [password, requirements]);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    if (flow === "signIn") {
      return email.length > 0 && password.length > 0 && isEmailValid;
    }
    return isEmailValid && passwordValidation.isValid;
  }, [flow, email, password, isEmailValid, passwordValidation]);

  const handleSubmit = () => {
    if (!isFormValid) {
      Alert.alert(
        "Validation Error",
        flow === "signIn"
          ? "Please enter a valid email and password"
          : "Please ensure all requirements are met"
      );
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("flow", flow);

    signIn(provider ?? "password", formData)
      .then(() => {
        handleSent?.(email);
      })
      .catch((error) => {
        console.error(error);
        let alertTitle: string;
        if (error instanceof ConvexError && error.data === INVALID_PASSWORD) {
          alertTitle = "Invalid password - check the requirements and try again.";
        } else {
          alertTitle =
            flow === "signIn"
              ? "Could not sign in, did you mean to sign up?"
              : "Could not sign up, did you mean to sign in?";
        }
        Alert.alert("Error", alertTitle);
        setSubmitting(false);
      });
  };

  const renderPasswordRequirements = () => {
    if (typeof passwordRequirements === "string") {
      return (
        <Text
          className={cn(
            "text-xs text-gray-600 -mt-2 mb-3",
            passwordTouched && !passwordValidation.isValid && "text-red-500"
          )}
        >
          {passwordRequirements}
        </Text>
      );
    }

    return (
      <View className="-mt-2 mb-4">
        {requirements.minLength && (
          <RequirementItem
            met={passwordValidation.checks.minLength}
            text={`At least ${requirements.minLength} characters`}
            touched={passwordTouched}
          />
        )}
        {requirements.requireUppercase && (
          <RequirementItem
            met={passwordValidation.checks.hasUppercase}
            text="One uppercase letter"
            touched={passwordTouched}
          />
        )}
        {requirements.requireLowercase && (
          <RequirementItem
            met={passwordValidation.checks.hasLowercase}
            text="One lowercase letter"
            touched={passwordTouched}
          />
        )}
        {requirements.requireNumber && (
          <RequirementItem
            met={passwordValidation.checks.hasNumber}
            text="One number"
            touched={passwordTouched}
          />
        )}
        {requirements.requireSpecialChar && (
          <RequirementItem
            met={passwordValidation.checks.hasSpecialChar}
            text="One special character"
            touched={passwordTouched}
          />
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-5">
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
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!submitting}
          />
          {emailTouched && !isEmailValid && (
            <Text className="text-red-500 text-xs mb-3 -mt-3">
              Please enter a valid email address
            </Text>
          )}

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-medium text-gray-800">Password</Text>
            {handlePasswordReset && flow === "signIn" && (
              <TouchableOpacity onPress={handlePasswordReset}>
                <Text className="text-blue-500 text-sm">Forgot your password?</Text>
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            className={cn(
              "border-2 rounded-lg px-3 py-4 text-base mb-4 bg-white text-gray-800 leading-tight",
              flow === "signUp" &&
                passwordTouched &&
                !passwordValidation.isValid &&
                "border-red-500",
              flow === "signUp" &&
                passwordTouched &&
                passwordValidation.isValid &&
                "border-green-500",
              (flow === "signIn" || !passwordTouched) && "border-gray-300"
            )}
            value={password}
            onChangeText={setPassword}
            onBlur={() => setPasswordTouched(true)}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry
            autoComplete={flow === "signIn" ? "current-password" : "new-password"}
            editable={!submitting}
          />

          {flow === "signUp" && renderPasswordRequirements()}

          {flow === "signUp" && customSignUp}

          <TouchableOpacity
            className={cn(
              "rounded-lg p-4 items-center mt-2 mb-4",
              !isFormValid || submitting ? "bg-gray-300 opacity-70" : "bg-blue-500"
            )}
            onPress={handleSubmit}
            disabled={!isFormValid || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                className={cn(
                  "text-base font-semibold",
                  !isFormValid || submitting ? "text-gray-100" : "text-white"
                )}
              >
                {flow === "signIn" ? "Sign in" : "Sign up"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setFlow(flow === "signIn" ? "signUp" : "signIn");
              setEmailTouched(false);
              setPasswordTouched(false);
            }}
            disabled={submitting}
          >
            <Text className="text-blue-500 text-sm text-center mt-2">
              {flow === "signIn"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
