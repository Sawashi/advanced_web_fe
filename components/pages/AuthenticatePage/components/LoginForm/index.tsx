import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Icon,
  Link,
  Stack,
  Text,
  chakra,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "components/FormInput";
import PasswordField from "components/PasswordField";
import {
  loginFailedDescription,
  loginSuccessDescription,
} from "constants/messages/auth.messages";
import { ILoginSchema, LoginSchema } from "constants/validation/auth";
import { useStores } from "hooks/useStores";
import routes from "routes";
import { SubmitButton } from "../../authenticatePage.styles";
import { FaFacebook, FaGoogle } from "react-icons/fa";
const LoginForm = () => {
  const method = useForm<ILoginSchema>({
    resolver: yupResolver(LoginSchema),
  });
  const { authStore } = useStores();
  const { isLoading } = authStore;
  const toast = useToast();
  const router = useRouter();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = method;

  useEffect(() => {
    if (authStore.user && authStore.user.id) {
      router.push(routes.home.value);
    }
  }, [authStore.user]);

  async function onSubmit(data: ILoginSchema): Promise<void> {
    try {
      const { email, password } = data;
      await authStore.login({ email, password });
      toast({
        status: "success",
        description: loginSuccessDescription,
      });
    } catch (error) {
      toast({
        status: "error",
        description: loginFailedDescription,
      });
    }
  }

  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="4">
          <FormInput
            name="email"
            label="Email address"
            placeholder="Your email"
            type="email"
          />
          <PasswordField
            name="password"
            label="Password"
            placeholder="Your password"
          />
          <HStack>
            <Text width="full" align="right" fontSize="sm">
              <Link
                href={`${routes.auth.forgotPassword.value}`}
                color="blue.600"
              >
                Forgot Password?
              </Link>
            </Text>
          </HStack>
          <SubmitButton type="submit" isLoading={isSubmitting || isLoading}>
            Log in
          </SubmitButton>
          <HStack>
            <Divider />
            <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
              or continue with
            </Text>
            <Divider />
          </HStack>
          <HStack spacing={2}>
            <Button
              flex="1"
              leftIcon={<Icon as={FaGoogle} />}
              colorScheme="red"
              variant="solid"
            >
              Google
            </Button>
            <Button
              flex="1"
              leftIcon={<Icon as={FaFacebook} />}
              colorScheme="facebook"
              variant="solid"
            >
              Facebook
            </Button>
          </HStack>
          <Text width="full" align="center" textAlign="center" fontSize="sm">
            Not a member?{" "}
            <Link href={`${routes.auth.register.value}`} color="black.600">
              <chakra.span color="blue.500">Sign up now</chakra.span>
            </Link>
          </Text>
        </Stack>
      </form>
    </FormProvider>
  );
};

export default observer(LoginForm);
