/**
 * Login Screen
 * User authentication screen matching webapp design
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
import {Sparkles, CheckCircle2} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {RootStackParamList} from '@types/navigation';
import {colors, typography, spacing, borderRadius, shadows, glassStyles} from '@theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Clear previous errors
    setError('');

    // Validate inputs
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual login logic in Phase 4
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Temporary: Navigate to main tabs
      // navigation.replace('MainTabs');

      Alert.alert('Login', 'Login functionality will be implemented in Phase 4');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
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
              <Sparkles color={colors.white} size={48} />
            </View>
            <Text style={styles.title}>Plant Disease Detector</Text>
            <Text style={styles.subtitle}>Sign in to analyze your plants</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

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
                placeholder="Enter your password"
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

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
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
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register Link */}
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>
                Don't have an account? <Text style={styles.registerLink}>Create one now</Text>
              </Text>
            </TouchableOpacity>

            {/* Features List */}
            <View style={styles.features}>
              <FeatureItem text="Instant disease detection" />
              <FeatureItem text="Expert treatment recommendations" />
              <FeatureItem text="Track your plant health history" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

// Feature Item Component
const FeatureItem: React.FC<{text: string}> = ({text}) => (
  <View style={styles.featureItem}>
    <CheckCircle2 color={colors.primary[500]} size={16} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

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
    paddingTop: spacing['6xl'],
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
  loginButton: {
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
  loginButtonText: {
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
  registerText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  registerLink: {
    color: colors.primary[600],
    fontWeight: '600',
  },
  features: {
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
});

export default LoginScreen;
