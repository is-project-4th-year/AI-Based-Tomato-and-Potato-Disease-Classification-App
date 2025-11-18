/**
 * Register Screen
 * User registration screen matching webapp design
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {UserPlus} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {RootStackParamList} from '@types/navigation';
import {colors, typography, spacing, borderRadius, shadows, glassStyles} from '@theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    // Clear previous errors
    setError('');

    // Validate inputs
    if (!name || !email || !password || !passwordConfirmation) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual registration logic in Phase 4
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert('Success', 'Registration functionality will be implemented in Phase 4');
      // navigation.replace('MainTabs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.background.gradient.from, colors.background.gradient.via, colors.background.gradient.to]}
      style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <UserPlus color={colors.white} size={48} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us to start protecting your plants</Text>
          </View>

          {/* Register Card */}
          <View style={styles.card}>
            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor={colors.gray[400]}
                value={name}
                onChangeText={text => {
                  setName(text);
                  if (error) setError('');
                }}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={colors.gray[400]}
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  if (error) setError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="At least 8 characters"
                placeholderTextColor={colors.gray[400]}
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  if (error) setError('');
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                placeholderTextColor={colors.gray[400]}
                value={passwordConfirmation}
                onChangeText={text => {
                  setPasswordConfirmation(text);
                  if (error) setError('');
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}>
              <LinearGradient
                colors={[colors.primary[500], colors.secondary[600]]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.gradientButton}>
                {isLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.registerButtonText}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Login Link */}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Sign in here</Text>
              </Text>
            </TouchableOpacity>

            {/* Terms */}
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['5xl'],
    paddingBottom: spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  card: {
    ...glassStyles.container,
    padding: spacing['2xl'],
  },
  errorContainer: {
    backgroundColor: colors.error.light,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.error.main,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error.text,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    ...glassStyles.input,
    ...typography.body,
    color: colors.text.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: Platform.OS === 'ios' ? spacing.lg : spacing.md,
  },
  registerButton: {
    marginTop: spacing.md,
    marginBottom: spacing['2xl'],
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  gradientButton: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  registerButtonText: {
    ...typography.button,
    color: colors.white,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[300],
    opacity: 0.5,
  },
  dividerText: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    paddingHorizontal: spacing.lg,
  },
  loginText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  loginLink: {
    color: colors.primary[600],
    fontWeight: '600',
  },
  termsText: {
    ...typography.captionSmall,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingTop: spacing.lg,
  },
  termsLink: {
    color: colors.primary[600],
  },
});

export default RegisterScreen;
