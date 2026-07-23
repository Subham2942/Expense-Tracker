import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-context';
import { getApiUrl } from '@/services/api-config';
import { AuthTokens } from '@/services/token-storage';

type Mode = 'login' | 'signup';
type Feedback = { message: string; type: 'error' | 'info' } | null;

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
};

const initialForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
};

const AUTH_API_URL = getApiUrl();

export default function AuthScreen() {
  const { login } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const isSignup = mode === 'signup';
  const title = isSignup ? 'Create your account' : 'Welcome back';
  const subtitle = isSignup
    ? 'Start tracking your money with confidence.'
    : 'Sign in to continue managing your expenses.';

  const canSubmit = useMemo(() => {
    const sharedFieldsComplete = form.username.trim() && form.password;
    return Boolean(
      sharedFieldsComplete &&
        (!isSignup || (form.firstName.trim() && form.lastName.trim() && form.email.trim()))
    );
  }, [form, isSignup]);

  function updateField(field: keyof FormState, value: string) {
    setFeedback(null);
    setForm((current) => ({ ...current, [field]: value }));
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setShowPassword(false);
    setFeedback(null);
  }

  function validate() {
    if (!canSubmit) return 'Please complete all required fields.';

    if (isSignup && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      return 'Enter a valid email address.';
    }

    if (
      isSignup &&
      (form.password.length < 8 ||
        !/[A-Z]/.test(form.password) ||
        !/[a-z]/.test(form.password) ||
        !/\d/.test(form.password) ||
        !/[^A-Za-z0-9]/.test(form.password))
    ) {
      return 'Use at least 8 characters with uppercase, lowercase, a number, and a symbol.';
    }

    return null;
  }

  async function submit() {
    const validationMessage = validate();
    if (validationMessage) {
      setFeedback({ message: validationMessage, type: 'error' });
      if (Platform.OS !== 'web') Alert.alert('Check your details', validationMessage);
      return;
    }

    if (!AUTH_API_URL) {
      Alert.alert(
        isSignup ? 'Account details look good' : 'Login details look good',
        'Set EXPO_PUBLIC_AUTH_API_URL to connect this form to the auth service.'
      );
      return;
    }

    const payload = isSignup
      ? {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          email: form.email.trim(),
          username: form.username.trim(),
          password: form.password,
        }
      : { username: form.username.trim(), password: form.password };

    try {
      setIsSubmitting(true);
      setFeedback(null);
      const response = await fetch(`${AUTH_API_URL}/auth/v1/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Something went wrong. Please try again.');
      }

      const tokens = (await response.json()) as AuthTokens;
      if (!tokens.accessToken || !tokens.refreshToken) {
        throw new Error('The auth service returned an invalid token response.');
      }
      await login(tokens);
    } catch (error) {
      const fallbackMessage =
        'Could not reach the auth service. Make sure Docker is running and this device is on the same network as your computer.';
      const message = error instanceof TypeError
        ? fallbackMessage
        : error instanceof Error
          ? error.message
          : fallbackMessage;
      setFeedback({ message, type: 'error' });
      if (Platform.OS !== 'web') Alert.alert('Unable to continue', message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Ionicons name="wallet-outline" size={30} color="#FFFFFF" />
            </View>
            <Text style={styles.brandName}>Pennywise</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>

            <View style={styles.segmentedControl}>
              {(['login', 'signup'] as Mode[]).map((item) => (
                <Pressable
                  accessibilityRole="button"
                  key={item}
                  onPress={() => changeMode(item)}
                  style={[styles.segment, mode === item && styles.activeSegment]}>
                  <Text style={[styles.segmentText, mode === item && styles.activeSegmentText]}>
                    {item === 'login' ? 'Log in' : 'Sign up'}
                  </Text>
                </Pressable>
              ))}
            </View>

            {isSignup && (
              <View style={styles.nameRow}>
                <Field
                  autoComplete="given-name"
                  containerStyle={styles.nameField}
                  label="First name"
                  onChangeText={(value) => updateField('firstName', value)}
                  placeholder="Alex"
                  value={form.firstName}
                />
                <Field
                  autoComplete="family-name"
                  containerStyle={styles.nameField}
                  label="Last name"
                  onChangeText={(value) => updateField('lastName', value)}
                  placeholder="Morgan"
                  value={form.lastName}
                />
              </View>
            )}

            {isSignup && (
              <Field
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                label="Email"
                onChangeText={(value) => updateField('email', value)}
                placeholder="alex@example.com"
                value={form.email}
              />
            )}

            <Field
              autoCapitalize="none"
              autoComplete="username"
              label="Username"
              onChangeText={(value) => updateField('username', value)}
              placeholder="alexmorgan"
              value={form.username}
            />

            <Field
              autoCapitalize="none"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              label="Password"
              onChangeText={(value) => updateField('password', value)}
              onSubmitEditing={submit}
              placeholder={isSignup ? 'Create a strong password' : 'Enter your password'}
              secureTextEntry={!showPassword}
              value={form.password}
              rightElement={
                <Pressable
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  hitSlop={12}
                  onPress={() => setShowPassword((visible) => !visible)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={21}
                    color="#667085"
                  />
                </Pressable>
              }
            />

            {!isSignup && (
              <Pressable style={styles.forgotButton} onPress={() => Alert.alert('Coming soon')}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            )}

            {isSignup && (
              <Text style={styles.passwordHint}>
                8+ characters with uppercase, lowercase, a number, and a symbol.
              </Text>
            )}

            {feedback && (
              <View
                accessibilityLiveRegion="polite"
                style={[styles.feedback, feedback.type === 'error' && styles.errorFeedback]}>
                <Ionicons
                  color={feedback.type === 'error' ? '#B54747' : '#176B4D'}
                  name={feedback.type === 'error' ? 'alert-circle-outline' : 'information-circle-outline'}
                  size={18}
                />
                <Text style={[styles.feedbackText, feedback.type === 'error' && styles.errorFeedbackText]}>
                  {feedback.message}
                </Text>
              </View>
            )}

            <Pressable
              accessibilityRole="button"
              disabled={!canSubmit || isSubmitting}
              onPress={submit}
              style={({ pressed }) => [
                styles.submitButton,
                (!canSubmit || isSubmitting) && styles.disabledButton,
                pressed && canSubmit && styles.pressedButton,
              ]}>
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitText}>{isSignup ? 'Create account' : 'Log in'}</Text>
              )}
            </Pressable>

            <Text style={styles.terms}>
              By continuing, you agree to our <Text style={styles.termsLink}>Terms</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FieldProps = React.ComponentProps<typeof TextInput> & {
  containerStyle?: object;
  label: string;
  rightElement?: React.ReactNode;
};

function Field({ containerStyle, label, rightElement, ...inputProps }: FieldProps) {
  return (
    <View style={[styles.field, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputShell}>
        <TextInput
          placeholderTextColor="#98A2B3"
          returnKeyType="done"
          style={styles.input}
          {...inputProps}
        />
        {rightElement}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F5' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingVertical: 32 },
  brand: { alignItems: 'center', marginBottom: 24 },
  logo: {
    alignItems: 'center',
    backgroundColor: '#176B4D',
    borderRadius: 18,
    height: 60,
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#176B4D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    width: 60,
  },
  brandName: { color: '#173B2D', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  card: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5EBE7',
    borderRadius: 28,
    borderWidth: 1,
    maxWidth: 480,
    padding: 24,
    shadowColor: '#102A20',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    width: '100%',
  },
  title: { color: '#14251E', fontSize: 28, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { color: '#667085', fontSize: 15, lineHeight: 22, marginTop: 7 },
  segmentedControl: {
    backgroundColor: '#F1F4F2',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 22,
    marginTop: 22,
    padding: 4,
  },
  segment: { alignItems: 'center', borderRadius: 9, flex: 1, paddingVertical: 10 },
  activeSegment: { backgroundColor: '#FFFFFF' },
  segmentText: { color: '#667085', fontSize: 14, fontWeight: '600' },
  activeSegmentText: { color: '#176B4D', fontWeight: '800' },
  nameRow: { flexDirection: 'row', gap: 12 },
  nameField: { flex: 1 },
  field: { marginBottom: 16 },
  label: { color: '#344054', fontSize: 13, fontWeight: '700', marginBottom: 7 },
  inputShell: {
    alignItems: 'center',
    backgroundColor: '#FBFCFB',
    borderColor: '#D7DFDA',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 14,
  },
  input: { color: '#14251E', flex: 1, fontSize: 16, minHeight: 50, paddingVertical: 12 },
  forgotButton: { alignSelf: 'flex-end', marginTop: -5 },
  forgotText: { color: '#176B4D', fontSize: 13, fontWeight: '700' },
  passwordHint: { color: '#7B8781', fontSize: 12, lineHeight: 17, marginTop: -6 },
  feedback: { alignItems: 'center', backgroundColor: '#EDF6F1', borderRadius: 10, flexDirection: 'row', gap: 8, marginTop: 14, padding: 11 },
  errorFeedback: { backgroundColor: '#FDEEEE' },
  feedbackText: { color: '#176B4D', flex: 1, fontSize: 12, lineHeight: 17 },
  errorFeedbackText: { color: '#9E3F3F' },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#176B4D',
    borderRadius: 13,
    justifyContent: 'center',
    marginTop: 18,
     minHeight: 52,
  },
  disabledButton: { backgroundColor: '#A8BDB5' },
  pressedButton: { opacity: 0.88 },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  terms: { color: '#8A9490', fontSize: 12, lineHeight: 18, marginTop: 17, textAlign: 'center' },
  termsLink: { color: '#176B4D', fontWeight: '700' },
});
