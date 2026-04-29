import { useLogin } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api/client';
import { useAuthStore } from '@/store/auth';
import { Link, Redirect } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

interface LoginFormData {
  email: string;
  password: string;
}

function isEmailValid(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}

export default function LoginScreen() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const loginMutation = useLogin();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  if (isAuthLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Logging in user:', data);
      await loginMutation.mutateAsync(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setError('root', { message: error.message });
      } else {
        setError('root', { message: 'Invalid credentials. Please try again.' });
      }
    }
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" className="flex-1 bg-background px-6 py-12">
      <View className="flex-1 justify-center gap-6 pt-12">
        <View className="gap-2 items-center mb-4">
          <Text className="text-3xl font-bold text-foreground text-center">Log in to your account</Text>
          <Text className="text-muted text-base text-center">Welcome back! Please enter your details.</Text>
        </View>

        <View className="gap-4">
          <View className="gap-2">
            <Text className="text-foreground font-medium">Email</Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                validate: (value) => isEmailValid(value) || 'Please enter a valid email address',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  className="bg-surface"
                />
              )}
            />
            {errors.email && <Text className="text-danger text-sm">{errors.email.message}</Text>}
          </View>

          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-foreground font-medium">Password</Text>
              <Pressable onPress={() => {}}>
                <Text className="text-accent text-sm font-medium">Forgot password?</Text>
              </Pressable>
            </View>
            <Controller
              control={control}
              name="password"
              rules={{ required: 'Password is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="••••••••"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  className="bg-surface"
                />
              )}
            />
            {errors.password && <Text className="text-danger text-sm">{errors.password.message}</Text>}
          </View>

          {errors.root && <Text className="text-danger text-sm">{errors.root.message}</Text>}

          <Button
            variant="primary"
            onPress={()=>{handleSubmit(onSubmit)()}}
            isLoading={loginMutation.isPending}
            className="mt-2 py-4 rounded-xl shadow-sm"
          >
            Sign in
          </Button>
        </View>

        <View className="flex-row items-center gap-4 my-2">
          <View className="flex-1 h-[1px] bg-border" />
          <Text className="text-muted text-sm font-medium">OR</Text>
          <View className="flex-1 h-[1px] bg-border" />
        </View>

        <View className="gap-3">
          <Button
            variant="outline"
            onPress={() => {}}
            className="py-4 rounded-xl bg-surface border-border border"
          >
            <Text className="text-foreground font-medium">Continue with Google</Text>
          </Button>
          <Button
            variant="outline"
            onPress={() => {}}
            className="py-4 rounded-xl bg-surface border-border border"
          >
            <Text className="text-foreground font-medium">Continue with Apple</Text>
          </Button>
        </View>

        <View className="flex-row justify-center gap-1 mt-4 mb-8">
          <Text className="text-muted">Don&apos;t have an account?</Text>
          <Link href="/(auth)/register" suppressHighlighting>
            <Text className="text-accent font-semibold">Sign up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
