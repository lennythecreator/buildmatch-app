import { useRegister } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api/client';
import { useAuthStore } from '@/store/auth';
import { IconBuilding, IconTools } from '@tabler/icons-react-native';
import { Link, Redirect } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';

type UserRole = 'INVESTOR' | 'CONTRACTOR';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

function isEmailValid(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}

function isPasswordValid(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

export default function RegisterScreen() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const registerMutation = useRegister();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'INVESTOR',
    },
  });

  const selectedRole = watch('role');

  const onInvalid = (validationErrors: unknown) => {
    console.log('Validation errors:', validationErrors);
  };

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

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log('Registering user:', data);
      await registerMutation.mutateAsync(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setError('root', { message: error.message });
      } else {
        setError('root', { message: 'Registration failed. Please try again.' });
      }
    }
  };

  const mutedColor = '#66707a';
  const accentColor = '#002743';

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      className="flex-1 bg-background px-6 py-12"
    >
      <View className="flex-1 justify-center gap-6 pt-8 pb-8">
        <View className="gap-2 items-center mb-2">
          <Text className="text-3xl font-bold text-foreground text-center">Create an account</Text>
          <Text className="text-muted text-base text-center">Join BuildMatch and start your journey.</Text>
        </View>

        <View className="gap-4">
          <Text className="text-foreground font-medium mb-1">I am a...</Text>
          <View className="flex-row gap-4 mb-2">
            <Pressable
              className="flex-1"
              onPress={() => setValue('role', 'INVESTOR')}
            >
              <Card className={"border-2 items-center gap-2 py-4 px-2 rounded-xl " + (selectedRole === 'INVESTOR' ? 'border-accent bg-accent-soft' : 'border-border bg-surface')}>
                <IconBuilding size={32} color={selectedRole === 'INVESTOR' ? accentColor : mutedColor} />
                <Text className={"font-semibold text-center " + (selectedRole === 'INVESTOR' ? 'text-accent' : 'text-foreground')}>Property Developer</Text>
              </Card>
            </Pressable>

            <Pressable
              className="flex-1"
              onPress={() => setValue('role', 'CONTRACTOR')}
            >
              <Card className={"border-2 items-center gap-2 py-4 px-2 rounded-xl " + (selectedRole === 'CONTRACTOR' ? 'border-accent bg-accent-soft' : 'border-border bg-surface')}>
                <IconTools size={32} color={selectedRole === 'CONTRACTOR' ? accentColor : mutedColor} />
                <Text className={"font-semibold text-center " + (selectedRole === 'CONTRACTOR' ? 'text-accent' : 'text-foreground')}>Contractor</Text>
              </Card>
            </Pressable>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1 gap-2">
              <Text className="text-foreground font-medium">First Name</Text>
              <Controller
                control={control}
                name="firstName"
                rules={{ required: 'Required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="John"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="bg-surface"
                  />
                )}
              />
              {errors.firstName && <Text className="text-danger text-sm">{errors.firstName.message}</Text>}
            </View>

            <View className="flex-1 gap-2">
              <Text className="text-foreground font-medium">Last Name</Text>
              <Controller
                control={control}
                name="lastName"
                rules={{ required: 'Required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Doe"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="bg-surface"
                  />
                )}
              />
              {errors.lastName && <Text className="text-danger text-sm">{errors.lastName.message}</Text>}
            </View>
          </View>

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
            <Text className="text-foreground font-medium">Password</Text>
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                validate: (value) =>
                  isPasswordValid(value) ||
                  'Password must be at least 8 characters with 1 uppercase letter and 1 number',
              }}
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
            onPress={handleSubmit(onSubmit, onInvalid)}
            isLoading={registerMutation.isPending}
            className="mt-2 py-4 rounded-xl shadow-sm"
          >
            Create account
          </Button>

          <View className="flex-row items-center gap-4 my-2">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-muted text-sm font-medium">OR</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          <View className="gap-3">
            <Button
              variant="outline"
              onPress={() => {}}
              className="py-4 rounded-xl bg-surface border-border border"
            >
              <Text className="text-foreground font-medium">Sign up with Google</Text>
            </Button>
            <Button
              variant="outline"
              onPress={() => {}}
              className="py-4 rounded-xl bg-surface border-border border"
            >
              <Text className="text-foreground font-medium">Sign up with Apple</Text>
            </Button>
          </View>

          <View className="flex-row justify-center gap-1 mt-4 mb-4">
            <Text className="text-muted">Already have an account?</Text>
            <Link href="/(auth)/login" suppressHighlighting>
              <Text className="text-accent font-semibold">Log in</Text>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
