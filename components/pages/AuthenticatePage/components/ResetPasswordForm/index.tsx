import { Spinner, Stack, useToast } from "@chakra-ui/react";
import get from "lodash/get";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { resetPassword } from "API/authenticate";
import PasswordField from "components/PasswordField";
import { PASSWORD_PATTERN } from "constants/common";
import {
  invalidPasswordDescription,
  notMatchedPasswordDescription,
  setPasswordFailedDescription,
  setPasswordInvalidTokenDescription,
  setPasswordSuccessDescription,
} from "constants/messages/auth.messages";
import { useStores } from "hooks/useStores";
import { IVerifyTokenResponse } from "interfaces/user";
import routes from "routes";
import { SubmitButton } from "../../authenticatePage.styles";

export interface IResetPasswordFormData {
  newPassword: string;
  confirmNewPassword: string;
  token: string;
}

const ResetPasswordForm = () => {
  const method = useForm<IResetPasswordFormData>();
  const toast = useToast();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = method;
  const router = useRouter();
  const isQueryReady = router && router.isReady;
  const { authStore } = useStores();
  const [resetPasswordToken, setResetPasswordToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isQueryReady) return;
    const query = router && get(router, "query", {});
    const token = get(query, "token", "");
    setResetPasswordToken(token);
    setIsLoading(false);
  }, [isQueryReady]);

  const showError = (error?: string): void => {
    toast({
      status: "error",
      description: error || "Something went wrong",
    });
  };

  const showSuccess = (message?: string): void => {
    toast({
      status: "success",
      description: message || "Change password successfully",
    });
    router.push(routes.auth.login.value);
  };

  async function onSubmit(data: IResetPasswordFormData): Promise<void> {
    try {
      const { newPassword, confirmNewPassword } = data;
      if (newPassword !== confirmNewPassword) {
        showError(notMatchedPasswordDescription);
        return;
      }
      if (!PASSWORD_PATTERN.test(newPassword)) {
        showError(invalidPasswordDescription);
        return;
      }
      const result = await resetPassword({
        ...data,
        token: resetPasswordToken,
      });
      if (!result) {
        showError(setPasswordFailedDescription);
      } else {
        const email: string = get(result, "email", "");
        email !== "" &&
          (await authStore.login({ email, password: newPassword }));
        showSuccess(setPasswordSuccessDescription);
        // router.push(routes.fleetManager.setFleet.value);
      }
    } catch (error) {
      showError(setPasswordFailedDescription);
    }
  }

  if (isLoading) {
    return (
      <Stack>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          alignSelf={"center"}
        />
      </Stack>
    );
  }

  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="6">
          <PasswordField
            name="newPassword"
            label="Your new password"
            placeholder="Your new password"
          />
          <PasswordField
            name="confirmNewPassword"
            label="Confirm Password"
            placeholder="Confirm Password"
          />
          <SubmitButton type="submit" isLoading={isSubmitting || isLoading}>
            Create new password
          </SubmitButton>
        </Stack>
      </form>
    </FormProvider>
  );
};

export default ResetPasswordForm;
