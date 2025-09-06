import { INVALID_PASSWORD } from "@/convex/errors";
import { useAuthActions } from "@convex-dev/auth/react";
import { ConvexError } from "convex/values";
import { useState, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
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

    const isValid = Object.values(checks).every(check => check);

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
        <Text style={[
          styles.requirementsText,
          passwordTouched && !passwordValidation.isValid && styles.requirementsTextError
        ]}>
          {passwordRequirements}
        </Text>
      );
    }

    return (
      <View style={styles.requirementsContainer}>
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
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[
              styles.input,
              emailTouched && !isEmailValid && styles.inputError,
              emailTouched && isEmailValid && styles.inputValid,
            ]}
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
            <Text style={styles.errorText}>Please enter a valid email address</Text>
          )}

          <View style={styles.passwordContainer}>
            <Text style={styles.label}>Password</Text>
            {handlePasswordReset && flow === "signIn" && (
              <TouchableOpacity onPress={handlePasswordReset}>
                <Text style={styles.linkText}>Forgot your password?</Text>
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            style={[
              styles.input,
              flow === "signUp" && passwordTouched && !passwordValidation.isValid && styles.inputError,
              flow === "signUp" && passwordTouched && passwordValidation.isValid && styles.inputValid,
            ]}
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
            style={[
              styles.button,
              (!isFormValid || submitting) && styles.buttonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[
                styles.buttonText,
                (!isFormValid || submitting) && styles.buttonTextDisabled
              ]}>
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
            <Text style={styles.switchText}>
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

function RequirementItem({ 
  met, 
  text, 
  touched 
}: { 
  met: boolean; 
  text: string; 
  touched: boolean;
}) {
  return (
    <View style={styles.requirementItem}>
      <Text style={[
        styles.requirementIcon,
        met && styles.requirementIconMet,
        touched && !met && styles.requirementIconError,
      ]}>
        {met ? "✓" : "○"}
      </Text>
      <Text style={[
        styles.requirementText,
        met && styles.requirementTextMet,
        touched && !met && styles.requirementTextError,
      ]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  inputError: {
    borderColor: "#FF5252",
    marginBottom: 4,
  },
  inputValid: {
    borderColor: "#4CAF50",
  },
  errorText: {
    color: "#FF5252",
    fontSize: 12,
    marginBottom: 12,
    marginTop: -4,
  },
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  linkText: {
    color: "#007AFF",
    fontSize: 14,
  },
  requirementsContainer: {
    marginTop: -8,
    marginBottom: 16,
  },
  requirementsText: {
    fontSize: 12,
    color: "#666",
    marginTop: -8,
    marginBottom: 12,
  },
  requirementsTextError: {
    color: "#FF5252",
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  requirementIcon: {
    fontSize: 14,
    marginRight: 8,
    color: "#999",
    width: 16,
    textAlign: "center",
  },
  requirementIconMet: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  requirementIconError: {
    color: "#FF5252",
  },
  requirementText: {
    fontSize: 12,
    color: "#666",
  },
  requirementTextMet: {
    color: "#4CAF50",
  },
  requirementTextError: {
    color: "#FF5252",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextDisabled: {
    color: "#f5f5f5",
  },
  switchText: {
    color: "#007AFF",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
});