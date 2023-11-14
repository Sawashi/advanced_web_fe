import { Link, Stack, Text, useToast } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { get } from "lodash";
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
import { LoginSchema } from "constants/validation/auth";
import { useStores } from "hooks/useStores";
import routes from "routes";
import { SubmitButton } from "../../authenticatePage.styles";

export interface ILoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const method = useForm<ILoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
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
    // if (authStore.user && authStore.user.id) {
    //   if (get(authStore.user, "role", "") === "SuperAdmin") {
    //     router.push(routes.superAdmin.value);
    //   } else {
    //     router.push(routes.fleetManager.setFleet.value);
    //   }
    // }
  }, [authStore.user]);

  async function onSubmit(data: ILoginFormData): Promise<void> {
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
          <Text width="full" align="right" fontSize="sm">
            <Link href={`${routes.auth.forgotPassword.value}`} color="blue.600">
              Forgot Password?
            </Link>
          </Text>
          <SubmitButton type="submit" isLoading={isSubmitting || isLoading}>
            Log in
          </SubmitButton>
        </Stack>
      </form>
    </FormProvider>
  );
};

export default observer(LoginForm);
